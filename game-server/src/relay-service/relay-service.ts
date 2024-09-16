import { WebSocketServer, WebSocket, MessageEvent, CloseEvent } from "ws";
import crypto from "crypto";
import { IncomingMessage } from "http";

import { connectionLogic, messageLogic } from "@/relay-service/logic";
import type { ConnectionResult, MessageResult } from "@/relay-service/types";

import { State } from "@/states/types";

import PlayerDB from "@/player-db/player-db";

import { InputContainer, LeaveOutput, SeqNumOutput } from "@/types";

export default class RelayService {
  wss: WebSocketServer
  stateMap: Map<string, State>
  playerDB: PlayerDB

  constructor(wss: WebSocketServer, stateMap: Map<string, State>, playerDB: PlayerDB) {
    this.wss = wss;
    this.stateMap = stateMap;
    this.playerDB = playerDB;
  }

  connectionHandler(socket: WebSocket, request: IncomingMessage) {
    let startingSeqNum = crypto.randomInt(1000);

    let result: ConnectionResult = connectionLogic(request.url, process.env.playerIdTokenSecret!);

    switch(result.decision) {
      case "badConnectionRequest":
        let leaveOutput: LeaveOutput = {
          type: "leave",
          outputContainer: {
            subType: "badConnectionRequest",
            data: {}
          }
        }
        socket.send(JSON.stringify(leaveOutput));
        socket.close();
        break;
      case "add":
        (socket as any).playerId = result.playerId;
        (socket as any).seqNum = startingSeqNum;
              
        let seqNumOutput: SeqNumOutput = {
          type: "seqNum",
          outputContainer: {
            subType: "",
            data: {
              seqNum: startingSeqNum
            }
          }
        };
        socket.send(JSON.stringify(seqNumOutput));

        socket.addEventListener("message", (event: MessageEvent) => {
          this.messageHandler(event.target, event.data as string);
        });

        socket.addEventListener("close", (event: CloseEvent) => {
          this.clientCloseHandler(event.target);
        });
        
        let connectingState = this.stateMap.get("connecting") as any;
        connectingState.transitionInto(result.playerId, result.username, socket);
    }
  }

  sendHandler(playerId: string, message: {}) {
    let currPlayer = this.playerDB.getPlayer(playerId); //accounting for dummy players
    currPlayer?.socket?.send(JSON.stringify(message));
  }

  messageHandler(socket: WebSocket, message: string) {
    let currSeqNum = (socket as any).seqNum as number; //will be present

    let result: MessageResult = messageLogic(socket.readyState, currSeqNum, message);

    switch(result.decision) {
      case "ignore":
        return; //ignore the result since this came in after closing
    }

    let playerId = (socket as any).playerId as string;    
    let currPlayer = this.playerDB.getPlayer(playerId)!; //will be present
    let currState = this.stateMap.get(currPlayer.status)! as any;

    switch(result.decision) {
      case "leave":
        let overridenInputContainer: InputContainer = {
          type: currPlayer.status+"Leave",
          input: "deliberate"
        }
        currState.inputHandler(playerId, overridenInputContainer);
        break;
      case "handle":
        //Take care of seqNum
        let newSeqNum = crypto.randomInt(1000);
        (socket as any).seqNum = newSeqNum
        let seqNumOutput: SeqNumOutput = {
          type: "seqNum",
          outputContainer: {
            subType: "",
            data: {
              seqNum: newSeqNum
            }
          }
        };
        socket.send(JSON.stringify(seqNumOutput));

        //Take care of input
        let inputContainer = result.parsedMessage.inputContainer;
        currState.inputHandler(playerId, inputContainer);
    }
  }

  serverCloseHandler(socket: WebSocket | null) {
    //Socket may be null if the player has already disconnected
    socket?.removeAllListeners();
    socket?.close();
  }

  clientCloseHandler(socket: WebSocket) {
    let playerId = (socket as any).playerId as string;    
    let currentPlayer = this.playerDB.getPlayer(playerId); 
    
    //There is a period of time where socket events are still queued after we initiate a close.
    if(!currentPlayer) { 
      return;
    }
    
    let currentState = this.stateMap.get(currentPlayer.status)! as any;

    //Null socket on player
    currentPlayer.socket = null;

    //Perform a bit of cleanup at the state they were in when they left. 
    currentState.temporaryLeave(playerId);
  }
}
