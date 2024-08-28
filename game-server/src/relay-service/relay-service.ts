import { WebSocketServer, WebSocket, MessageEvent } from "ws";
import crypto from "crypto";
import type { IncomingMessage } from "http";

import { connectionLogic, messageLogic } from "./logic";
import type { ConnectionResult, MessageResult } from "./types";
import { State } from "../states/types";
import PlayerDB from "../player-db/player-db";

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
      case "terminate":
        socket.terminate();
        break;
      case "add":
        (socket as any).playerId = result.playerId;
        (socket as any).seqNum = startingSeqNum;
                
        socket.send(JSON.stringify({
          type: "seqNum",
          seqNum: startingSeqNum
        }));

        socket.addEventListener("message", (event: MessageEvent) => {
          this.messageHandler(event.target, event.data as string);
        })

        let connectingState = this.stateMap.get("connecting") as any;
        connectingState.transitionInto(result.playerId, result.username, socket);
    }
  }

  sendHandler(playerId: string, message: string) {
    let currPlayer = this.playerDB.getPlayer(playerId);
    currPlayer?.socket?.send(message);
  }

  messageHandler(socket: WebSocket, message: string) {
    let playerId = ((socket as any).playerId) as string; //will be present
    let currSeqNum = ((socket as any).seqNum) as number; //will be present
    let currPlayer = this.playerDB.getPlayer(playerId)!; //will be present
    
    let result: MessageResult = messageLogic(currSeqNum, message);

    (socket as any).seqNum = crypto.randomInt(1000);
    socket.send(JSON.stringify({
      type: "seqNum",
      seqNum: (socket as any).seqNum
    }));

    let currState = this.stateMap.get(currPlayer.status)! as any;
    switch(result.decision) {
      case "leave":
        let overridenInput = {
          type: currPlayer.status+"Leave",
          input: ""
        }
        currState.inputHandler(playerId, overridenInput);
        break;
      case "handle":
        let parsedMessage = JSON.parse(message);
        let input = { 
          type: parsedMessage.type,
          input: parsedMessage.input
        }      
        currState.inputHandler(playerId, input);
    }
  }

  serverCloseHandler(socket: WebSocket | null) {
    socket?.close();
  }
}
