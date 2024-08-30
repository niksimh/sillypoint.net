import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { InputContainer } from "../../types";
import { State } from "../types"
import { GameSelectionOutput } from "./types";

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
    let currPlayer = this.playerDB.getPlayer(playerId)!;
    
    currPlayer.status = "gameSelection";

    let gameSelectionOutput: GameSelectionOutput = {
      type: "gameState",
      state: "gameSelection"
    }
    this.relayService.sendHandler(playerId, JSON.stringify(gameSelectionOutput));
  }

  gameSelectionLeave(playerId: string) {
    let currPlayer = this.playerDB.getPlayer(playerId)!;
    
    this.playerDB.removePlayer(playerId);
    
    let playerSocket = currPlayer.socket;
    this.relayService.serverCloseHandler(playerSocket);
  }

  selectGame(playerId: string, input: string) {
    switch(input) {
      case "publicWaitingRoom":
        let publicWaitingRoom = this.stateMap.get("publicWaitingRoom") as any;
        publicWaitingRoom.transitionInto(playerId);
        break;
      case "privateWaitingRoomCreator":
        let privateWaitingRoomC = this.stateMap.get("privateWaitingRoom") as any;
        privateWaitingRoomC.transitionInto(playerId, "creator");
        break;
      case "privateWaitingRoomJoiner": 
        let privateWaitingRoomJ = this.stateMap.get("privateWaitingRoom") as any;
        privateWaitingRoomJ.transitionInto(playerId, "joiner");
        break;
      default:
        this.gameSelectionLeave(playerId);
        break;
    }
  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "gameSelectionLeave":
        this.gameSelectionLeave(playerId);
        break;
      case "selectGame":
        this.selectGame(playerId, inputContainer.input);
        break;
      default:
        //ignore input as it is out of sync with server
    }
  }
}
