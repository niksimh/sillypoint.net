import type PlayerDB from "../../player-db/player-db"
import type RelayService from "../../relay-service/relay-service"
import { State } from "../types"

export default class PrivateWaitingRoom {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService

  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.relayService = relayService;
  }
  
}
