import { WebSocketServer, WebSocket } from "ws";
import crypto from "crypto";
import type { IncomingMessage } from "http";

import { connectionLogic, messageLogic } from "./logic";
import type { ConnectionResult, messageResult } from "./types";
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
    let startingSeqNumber = crypto.randomInt(1000);

    let result: ConnectionResult = connectionLogic(request.url, process.env.playerIdTokenSecret!);

    switch(result.decision) {
      case "terminate":
        socket.terminate();
        break;
      case "add":
        (socket as any).playerId = result.playerId;
        (socket as any).seqNumber = startingSeqNumber;
        
        socket.send(JSON.stringify({
          type: "seqNumber",
          seqNumber: startingSeqNumber
        }));

        let connectingState = this.stateMap.get("connecting") as any;
        connectingState.transitionInto(result.playerId, result.username, socket);
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
