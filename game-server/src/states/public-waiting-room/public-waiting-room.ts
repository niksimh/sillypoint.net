import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service"
import { State } from "../types"
import { LeaveResult, ProcessResult, PublicWaitingRoomOutput, WaitingNode } from "./types"
import { leaveLogic, processLogic } from "./logic"

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

    setInterval(() => { this.process() }, 100);
  }

  transitionInto(playerId: string) {
    let currPlayer = this.playerDB.getPlayer(playerId)!;
    
    currPlayer.status = "publicWaitingRoom";
    
    this.waitingQueue.push({
      playerId: playerId,
      timeJoined: Date.now()
    });

    let publicWaitingRoomOutput: PublicWaitingRoomOutput = {
      type: "gameState",
      outputContainer: {
        subType: "publicWaitingRoom",
        data: {}
      }
    };
    
    this.relayService.sendHandler(playerId, JSON.stringify(publicWaitingRoomOutput));
  }
  
  process() {
    let result: ProcessResult = processLogic(this.waitingQueue, Date.now());
    
    let lobbyState = this.stateMap.get("lobby")! as any;
    switch(result.decision) {
      case 0:
        break;
      case 1:
        let p = this.waitingQueue.shift()!;
        lobbyState.transitionInto(p.playerId);
        break;
      case 2:
        let p1 = this.waitingQueue.shift()!;
        let p2 = this.waitingQueue.shift()!;
        lobbyState.transitionInto(p1.playerId, p2.playerId);
        break;
    }
  }

  publicWaitingRoomLeave(playerId: string) {
    let result: LeaveResult = leaveLogic(playerId, this.waitingQueue);

    let currPlayer = this.playerDB.getPlayer(playerId)!;
    switch(result.decision) {
      case "processedLeave":
        this.waitingQueue.splice(result.index, 1);
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
      case "unprocessedLeave":
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
    }
  }

  inputHandler(playerId: string, inputContainer: { type: string, input: string}) {
    switch(inputContainer.type) {
      case "publicWaitingRoomLeave":
        this.publicWaitingRoomLeave(playerId);
        break;
      default:
        break;
    }
    
  }
}
