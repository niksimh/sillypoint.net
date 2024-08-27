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
  socketMap: Map<string, WebSocket>

  constructor(wss: WebSocketServer, stateMap: Map<string, State>, playerDB: PlayerDB) {
    this.wss = wss;
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.socketMap = new Map();
  }

  connectionHandler(socket: WebSocket, request: IncomingMessage) {
    let newSocketId = crypto.randomUUID();
    let startingSeqNumber = crypto.randomInt(1000);

    let result: connectionResult = connectionLogic(request.url, process.env.playerIdTokenSecret!);
    
    switch(result.decision) {
      case "add":
        let newPlayer = {
          username: result.username,
          socketId: newSocketId,
          status: "connecting"
        }
        this.playerDB.addPlayer(result.playerId, newPlayer);
        
        this.socketMap.set(newSocketId, socket);
        (socket as any).playerId = result.playerId;
        (socket as any).seqNumber = startingSeqNumber;
        
        socket.send(JSON.stringify({
          type: "seqNumber",
          seqNumber: startingSeqNumber
        }));

        let gameSelectionState = this.stateMap.get("gameSelection");
        (gameSelectionState as any).transitionInto(result.playerId);

        break;
      case "terminate":
        socket.terminate();
    }
  }

  sendHandler(playerId: string, message: string) {
    let currPlayer = this.playerDB.getPlayer(playerId);
    let currSocket = this.socketMap.get(currPlayer?.socketId || "");
    currSocket?.send(message);
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
