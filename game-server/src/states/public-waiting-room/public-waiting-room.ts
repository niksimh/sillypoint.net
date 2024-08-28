import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service"
import { State } from "../types"
import { WaitingNode } from "./types"

export default class PublicWaitingRoom {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  waitingQueue: WaitingNode[]
  relayService: RelayService

  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.waitingQueue = [];
    this.relayService = relayService;
  }

  transitionInto(playerId: string) {
    let currPlayer = this.playerDB.getPlayer(playerId)!;
    
    currPlayer.status = "publicWaitingRoom";
    
    this.waitingQueue.push({
      playerId: playerId,
      timeJoined: Date.now()
    });

    this.relayService.sendHandler(playerId, JSON.stringify({
      gameState: "publicWaitingRoom",
      data: {}
    }));
  }
  
  leavePublicWaitingRoom(playerId: string) {
  
  }

  inputHandler(playerId: string, inputContainer: { type: string, input: string}) {
    //Only input is to leave
    this.leavePublicWaitingRoom(playerId);
  }
}
