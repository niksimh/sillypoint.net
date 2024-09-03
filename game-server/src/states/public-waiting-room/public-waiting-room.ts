import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service"
import { State } from "../types"
import { LeaveResult, ProcessResult, PublicWaitingRoomOutput, WaitingNode } from "./types"
import { leaveLogic, processLogic } from "./logic"
import { InputContainer } from "../../types"

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

    setInterval(() => { this.processWaitingQueue() }, 100);
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
    
    this.relayService.sendHandler(playerId, publicWaitingRoomOutput);
  }
  
  processWaitingQueue() {
    let result: ProcessResult = processLogic(this.waitingQueue, Date.now());
    
    let lobbyState = this.stateMap.get("lobby")! as any;
    switch(result.decision) {
      case 0:
        break;
      case 1:
        let player = this.waitingQueue.shift()!;
        lobbyState.transitionInto(player.playerId);
        break;
      case 2:
        let player1 = this.waitingQueue.shift()!;
        let player2 = this.waitingQueue.shift()!;
        lobbyState.transitionInto(player1.playerId, player2.playerId);
        break;
    }
  }

  leave(playerId: string) {
    let currentPlayer = this.playerDB.getPlayer(playerId)!;

    let result: LeaveResult = leaveLogic(playerId, this.waitingQueue);

    this.waitingQueue.splice(result.index, 1);
    this.playerDB.removePlayer(playerId);
    this.relayService.serverCloseHandler(currentPlayer.socket);
  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "publicWaitingRoomLeave":
        this.leave(playerId);
        break;
      default:
        break;
    }
  }
}
