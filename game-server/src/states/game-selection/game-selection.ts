import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { InputContainer, LeaveOutput } from "../../types";
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
        this.leave(playerId, "badInput");
        break;
    }
  }

  leave(playerId: string, input: string) {
    //Nothing to cleanup at this state
    
    //Send appropriate leave output 
    switch(input) {
      case "badInput":
        let badInputLeave: LeaveOutput = {
          type: "leave",
          outputContainer: {
            subType: "badInput",
            data: {}
          }
        };
        this.relayService.sendHandler(playerId, badInputLeave);
        break;
      case "timeout":
        let timeoutLeave: LeaveOutput = {
          type: "leave",
          outputContainer: {
            subType: "timeout",
            data: {}
          }
        };
        this.relayService.sendHandler(playerId, timeoutLeave);
        break;
      default:
        let deliberateLeave: LeaveOutput = {
          type: "leave",
          outputContainer: {
            subType: "deliberate",
            data: {}
          }
        };
        this.relayService.sendHandler(playerId, deliberateLeave);
        break;
    }
    
    //Cleanup player
    let currentPlayer = this.playerDB.getPlayer(playerId)!;
    this.playerDB.removePlayer(playerId);
    
    let playerSocket = currentPlayer.socket;
    this.relayService.serverCloseHandler(playerSocket);
  }

  rejoin(playerId: string) {
    let gameSelectionOutput: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "gameSelection",
        data: {}
      }
    };
    
    this.relayService.sendHandler(playerId, gameSelectionOutput);
  }

  temporaryLeave(playerId: string) {
    //Nothing to clean up here
  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "gameSelectionLeave":
        this.leave(playerId, inputContainer.input);
        break;
      case "selectGame":
        this.selectGame(playerId, inputContainer.input);
        break;
      default:
        //ignore input as it is out of sync with server
    }
  }
}
