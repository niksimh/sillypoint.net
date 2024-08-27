import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { messageLogic } from "./logic";
import type { messageResult } from "./types";

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
    let connectionState = this.stateMap.get("connecting") as any;
    connectionState.transitionInto(socket, request.url);
  }

  closeFromSocket(socket: WebSocket) {
    socket.close();
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
