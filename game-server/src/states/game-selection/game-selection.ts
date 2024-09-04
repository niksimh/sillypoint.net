import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { InputContainer } from "../../types";
import { State, GameStateOutput } from "../types"

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
    let currentPlayer = this.playerDB.getPlayer(playerId)!;
    
    currentPlayer.status = "gameSelection";

    let gameSelectionOutput: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "gameSelection",
        data: {}
      }
    };
    
    this.relayService.sendHandler(playerId, gameSelectionOutput);
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
        this.leave(playerId);
        break;
    }
  }

  leave(playerId: string) {
    //Nothing to cleanup at this state
    let currentPlayer = this.playerDB.getPlayer(playerId)!;
    
    this.playerDB.removePlayer(playerId);
    
    let playerSocket = currentPlayer.socket;
    this.relayService.serverCloseHandler(playerSocket);
  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "gameSelectionLeave":
        this.leave(playerId);
        break;
      case "selectGame":
        this.selectGame(playerId, inputContainer.input);
        break;
      default:
        //ignore input as it is out of sync with server
    }
  }
}
