import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import crypto from "crypto";

import { connectionLogic, messageLogic } from "./logic";
import type { connectionResult, messageResult } from "./types";

import type { State } from "../states/types"
import type PlayerDB from "../player-db/player-db";

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
    let startingSeqNumber = crypto.randomInt(1000);

    let result: connectionResult = connectionLogic(request.url, process.env.playerIdTokenSecret!);
    
    switch(result.decision) {
      case "add":
        let newPlayer = {
          username: result.username,
          socket: socket,
          status: "connecting"
        }
        this.playerDB.addPlayer(result.playerId, newPlayer);
        
        (socket as any).playerId = result.playerId;
        (socket as any).seqNumber = startingSeqNumber;
        
        socket.send(JSON.stringify({
          type: "seqNumber",
          seqNumber: startingSeqNumber
        }));

        let gameSelectionState = this.stateMap.get("gameSelection") as any;
        gameSelectionState.transitionInto(result.playerId);

        break;
      case "terminate":
        socket.terminate();
    }
  }

  sendHandler(playerId: string, message: string) {
    let currPlayer = this.playerDB.getPlayer(playerId);
    currPlayer?.socket?.send(message);
  }

  messageHandler(socket: WebSocket, message: string) {
    let playerId = (socket as any).playerId;
    let currPlayer = this.playerDB.getPlayer(playerId || "");
    
    let result: messageResult = messageLogic(currPlayer, message);

    switch(result.decision) {
      case "ignore":
        break;
      case "handle":
        let currState = this.stateMap.get(result.state)!;
        (currState as any).inputHandler(playerId, message);
    }
  }
}
