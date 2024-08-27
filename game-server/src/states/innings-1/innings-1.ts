import type PlayerDB from "../../player-db/player-db"
import { State } from "../types"

export default class Innings1 {
  stateMap: Map<string, State>
  playerDB: PlayerDB

  constructor(stateMap: Map<string, State>, playerDB: PlayerDB) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
  }
  
}
