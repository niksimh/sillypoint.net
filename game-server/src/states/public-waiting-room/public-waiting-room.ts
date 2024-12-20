import PlayerDB from "@/player-db/player-db"

import RelayService from "@/relay-service/relay-service"

import { InputContainer, LeaveOutput, GameStateOutput } from "@/types"

import { State } from "@/states/types"

import { WaitingNode } from "@/states/public-waiting-room/types"
import { leaveLogic, processLogic } from "@/states/public-waiting-room/logic"

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

    setInterval(() => { this.processWaitingQueue() }, 6000);
  }

  transitionInto(playerId: string) {
    let currPlayer = this.playerDB.getPlayer(playerId)!;
    
    currPlayer.status = "publicWaitingRoom";
    
    this.waitingQueue.push({
      playerId: playerId,
      timeJoined: Date.now()
    });

    let publicWaitingRoomOutput: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "publicWaitingRoom",
        data: {}
      }
    };
    
    this.relayService.sendHandler(playerId, publicWaitingRoomOutput);
  }
  
  //TODO: Change to a linked list approach. This is just quick and easy for now
  processWaitingQueue() {
    let result = processLogic(this.waitingQueue, Date.now());
    
    let lobbyState = this.stateMap.get("lobby")! as any;
    switch(result.decision) {
      case 0:
        break;
      case 1:
        let player = this.waitingQueue.shift()!;
        lobbyState.transitionInto([player.playerId]);
        break;
      case 2:
        let player1 = this.waitingQueue.shift()!;
        let player2 = this.waitingQueue.shift()!;
        lobbyState.transitionInto([player1.playerId, player2.playerId]);
        break;
    }
  }

  leave(playerId: string, input: string) {
    let currentPlayer = this.playerDB.getPlayer(playerId)!;

    let result = leaveLogic(playerId, this.waitingQueue);

    //Send leave output
    switch(input) {
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
    }


    this.waitingQueue.splice(result.index, 1);
    this.playerDB.removePlayer(playerId);
    this.relayService.serverCloseHandler(currentPlayer.socket);
  }

  rejoin(playerId: string) {
    let publicWaitingRoomOutput: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "publicWaitingRoom",
        data: {}
      }
    };
    
    this.relayService.sendHandler(playerId, publicWaitingRoomOutput);
  }

  temporaryLeave(playerId: string) {
    //Nothing to clean up here
  }
  
  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "publicWaitingRoomLeave":
        this.leave(playerId, inputContainer.input);
        break;
      default:
        break;
    }
  }
}
