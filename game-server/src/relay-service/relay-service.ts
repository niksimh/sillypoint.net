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
  socketMap: Map<string, WebSocket>

  constructor(wss: WebSocketServer, stateMap: Map<string, State>, playerDB: PlayerDB) {
    this.wss = wss;
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.socketMap = new Map();
  }

  connectionHandler(socket: WebSocket, request: IncomingMessage) {
    let newSocketId = crypto.randomUUID();

    let result: connectionResult = connectionLogic(request.url, newSocketId, process.env.playerIdTokenSecret!);
    
    switch(result.decision) {
      case "add":
        this.playerDB.addPlayer(result.playerId, result.player);
        this.socketMap.set(newSocketId, socket);

        (socket as any).socketId = newSocketId;
        (socket as any).playerId = result.playerId;
        
        let gameSelectionState = this.stateMap.get("gameSelection") as GameSelection;
        gameSelectionState.transitionInto(result.playerId);
      
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
}
