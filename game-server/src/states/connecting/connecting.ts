import type PlayerDB from "../../player-db/player-db"
import type RelayService from "../../relay-service/relay-service";
import { State } from "../types"
import type { WebSocket } from "ws";
import { TransitionIntoResult } from "./types";
import { transitionIntoLogic } from "./logic";

export default class Connecting {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService

  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.relayService = relayService;
  }
  
  transitionInto(playerId: string, username: string, socket: WebSocket) {
    let player = this.playerDB.getPlayer(playerId);

    let result: TransitionIntoResult = transitionIntoLogic(player);
    
    switch(result.decision) {
      case "close":
        this.relayService.serverCloseHandler(socket);
        break;
      case "add":
        let newPlayer = {
          username: username,
          socket: socket,
          status: "connecting"
        };
        this.playerDB.addPlayer(playerId, newPlayer);
              
        let gameSelectionState = this.stateMap.get("gameSelection") as any;
        gameSelectionState.transitionInto(playerId);
        break;
      case "rejoin":
        let currentState = this.stateMap.get(player!.status) as any;
        currentState.rejoin(playerId);
    }
  }
}
