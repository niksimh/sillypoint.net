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
    let currPlayer = this.playerDB.getPlayer(playerId)!;
    
    this.playerDB.removePlayer(playerId);
    
    let playerSocket = currPlayer.socket;
    this.relayService.serverCloseHandler(playerSocket);
  }

  selectGame(playerId: string, input: string) {
    switch(input) {
      case "publicWaitingRoom":
        console.log("pubWR");
        let publicWaitingRoom = this.stateMap.get("publicWaitingRoom") as any;
        publicWaitingRoom.transitionInto(playerId);
      case "privateWaitingRoomCreator":
        console.log("priWRC");
        let privateWaitingRoomC = this.stateMap.get("publicWaitingRoom") as any;
        privateWaitingRoomC.transitionInto(playerId, "creator");
      case "privateWaitingRoomJoiner": 
        console.log("priWRJ");
        let privateWaitingRoomJ = this.stateMap.get("publicWaitingRoom") as any;
        privateWaitingRoomJ.transitionInto(playerId, "joiner");
      default:
        this.leaveGameSelection(playerId, "");
    }
  }

  inputHandler(playerId: string, inputContainer: { type: string, input: string}) {
    switch(inputContainer.type) {
      case "gameSelectionLeave":
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
