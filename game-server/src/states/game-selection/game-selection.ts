import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { State } from "../types"
import { inputHandlerLogic } from "./logic";
import type { inputHandlerResult } from "./types";

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

    let updatePlayer = structuredClone(currPlayer);
    updatePlayer.status = "gameSelection"
    this.relayService.sendHandler(playerId, JSON.stringify({
      gameState: "gameSelection",
      data: {}
    }))
  }


  gameSelectionHandler(playerId: string, input: number) {

  }

  inputHandler(playerId: string, message: string) {
    let result: inputHandlerResult = inputHandlerLogic(message);

    switch(result.decision) {
      case "ignore":
        break;
      case "gameSelection":
        this.gameSelectionHandler(playerId, result.input);
    }
  }
}
