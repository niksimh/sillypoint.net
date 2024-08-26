import { WebSocketServer, WebSocket } from "ws"
import { State } from "../states/types"
import type PlayerDB from "../player-db/player-db";
import type { IncomingMessage } from "http"
import { connectionLogic } from "./logic";
import type { connectionResult } from "./types";
import type GameSelection from "../states/game-selection";

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
    let newSocketId = crypto.randomUUID();

    let result: connectionResult = connectionLogic(request.url, newSocketId, process.env.playerIdTokenSecret!);
    
    switch(result.decision) {
      case "add":
        this.playerDB.addPlayer(result.playerId!, result.player!);
        (socket as any).socketId = newSocketId;
        (socket as any).playerId = result.playerId!
        
        let gameSelectionState = this.stateMap.get("gameSelection") as GameSelection
        gameSelectionState.transitionInto(result.playerId!)
        
        break;
      case "terminate":
        socket.terminate();
    }
  }
}
