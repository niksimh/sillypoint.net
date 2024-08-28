import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { State } from "../types"

export default class GameSelection {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService

  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.relayService = relayService;
  }
 
  transitionInto(playerId: string) {
    let currPlayer = this.playerDB.getPlayer(playerId)
    
    if(currPlayer === undefined) {
      return;
    }

    currPlayer.status = "gameSelection";

    this.relayService.sendHandler(playerId, JSON.stringify({
      gameState: "gameSelection",
      data: {}
    }))
  }

  leaveGameSelection(playerId: string, input: string) {
    
  }

  selectGame(playerId: string, input: string) {

  }

  inputHandler(playerId: string, inputContainer: { type: string, input: string}) {
    switch(inputContainer.type) {
      case "leaveGameSelection":
        this.leaveGameSelection(playerId, inputContainer.input);
        break;
      case "selectGame":
        this.selectGame(playerId, inputContainer.input);
        break;
      default:
        //ignore input
    }
  }
}
