import type PlayerDB from "../../player-db/player-db"
import type RelayService from "../../relay-service/relay-service";
import { State } from "../types"
import type { WebSocket } from "ws";

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
    let newPlayer = {
      username: username,
      socket: socket,
      status: "connecting"
    };
    this.playerDB.addPlayer(playerId, newPlayer);
          
    let gameSelectionState = this.stateMap.get("gameSelection") as any;
    gameSelectionState.transitionInto(playerId);
  }
}
