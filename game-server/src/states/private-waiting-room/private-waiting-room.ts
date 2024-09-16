import crypto from "crypto";

import type PlayerDB from "@/player-db/player-db"

import type RelayService from "@/relay-service/relay-service"

import { State } from "@/states/types"

import { InputContainer, LeaveOutput, GameStateOutput } from "@/types";

import { joinLogic, kickLogic, leaveLogic, rejoinLogic, startGameLogic } from "@/states/private-waiting-room/logic";
import { 
  JoinResult, 
  KickResult, 
  LeaveResult, 
  RejoinResult, 
  StartGameResult, 
  WaitingRoom,
 } from "@/states/private-waiting-room/types"

export default class PrivateWaitingRoom {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService
  waitingRooms: Map<number, WaitingRoom>
  playerToWaitingRoom: Map<string, number>

  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.relayService = relayService;
    this.waitingRooms = new Map();
    this.playerToWaitingRoom = new Map;
  }

  transitionInto(playerId: string, position: "creator" | "joiner") {
    let currPlayer = this.playerDB.getPlayer(playerId)!;

    currPlayer.status = "privateWaitingRoom";

    switch(position) {
      case "creator":
        let roomId = crypto.randomInt(1000, 10000);
        
        let newWaitingRoom: WaitingRoom = {
          creatorId: playerId,
          joinerId: null
        }

        this.waitingRooms.set(roomId, newWaitingRoom);
        this.playerToWaitingRoom.set(playerId, roomId);

        let creatorOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomCreator",
            data: {               
              roomId: roomId
            }
          }
        }
        this.relayService.sendHandler(playerId, creatorOutput);
        break;
      case "joiner":
        let joinerOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomJoiner",
            data: {
              status: "pending"
            }
          }
        };
        this.relayService.sendHandler(playerId, joinerOutput);
        break;
    }
  }

  join(playerId: string, input: string) {
    let result: JoinResult = joinLogic(this.waitingRooms, this.playerToWaitingRoom, playerId, input);

    switch(result.decision) {
      case "present":
        this.leave(playerId, "badInput");
        break;
      case "badInput":
        this.leave(playerId, "badInput");
        break;
      case 'badRoom':
        let badRoomOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomJoiner",
            data: {
              status: "badRoom"
            }
          }
        };
        this.relayService.sendHandler(playerId, badRoomOutput);
        break;
      case "fullRoom":
        let fullRoomOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomJoiner",
            data: {
              status: "fullRoom"
            }
          }
        };
        this.relayService.sendHandler(playerId, fullRoomOutput);
        break;
      case "succesful":
        let roomId = Number(input);

        this.playerToWaitingRoom.set(playerId, roomId);
        
        let currWaitingRoom = this.waitingRooms.get(roomId)!;
        currWaitingRoom.joinerId = playerId;

        //Output to joiner
        let joinerJoinedOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomJoiner",
            data: {
              status: "joined",    
              otherPlayerUsername: this.playerDB.getPlayer(currWaitingRoom.creatorId)!.username
            }
          }
        }
        this.relayService.sendHandler(playerId, joinerJoinedOutput);

        //Output to creator
        let creatorOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomCreator",
            data: {
              otherPlayerUsername: this.playerDB.getPlayer(currWaitingRoom.joinerId)!.username
            }
          }
        }
        this.relayService.sendHandler(currWaitingRoom.creatorId, creatorOutput);
        break;
    }
  }

  kick(playerId: string) {
    let result: KickResult = kickLogic(this.waitingRooms, this.playerToWaitingRoom, playerId);

    switch(result.decision) {
      case "notPresent":
        this.leave(playerId, "badInput");
        break;
      case "notCreator":
        this.leave(playerId, "badInput");
        break;
      case "empty":
        this.leave(playerId, "badInput");
        break;
      case "successful":
        let newRoomId = crypto.randomInt(1000, 10000);
        let currRoomId = this.playerToWaitingRoom.get(playerId)!
        let waitingRoom = this.waitingRooms.get(currRoomId)!;
        let joinerId = waitingRoom.joinerId!;

        this.playerToWaitingRoom.set(playerId, newRoomId);
        this.playerToWaitingRoom.delete(joinerId);
        this.waitingRooms.delete(currRoomId);
        this.waitingRooms.set(newRoomId, { creatorId: playerId, joinerId: null });

        //Creator output 
        let creatorOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomCreator",
            data: {
              roomId: newRoomId
            }
          }
        };
        this.relayService.sendHandler(playerId, creatorOutput);

        //Transition joiner back to gameSelection
        let gameSelectionState = this.stateMap.get("gameSelection")! as any;
        gameSelectionState.transitionInto(joinerId);
    }
  }

  startGame(playerId: string) {
    let result: StartGameResult = startGameLogic(this.waitingRooms, this.playerToWaitingRoom, playerId);

    switch(result.decision) {
      case "notPresent":
        this.leave(playerId, "badInput");
        break;
      case "notCreator":
        this.leave(playerId, "badInput");
        break;
      case "noJoiner":
        this.leave(playerId, "badInput");
        break;
      case "successful":
        let roomId = this.playerToWaitingRoom.get(playerId)!;
        let waitingRoom = this.waitingRooms.get(roomId)!;

        this.playerToWaitingRoom.delete(waitingRoom.creatorId);
        this.playerToWaitingRoom.delete(waitingRoom.joinerId!);
        this.waitingRooms.delete(roomId);

        let lobbyState = this.stateMap.get("lobby")! as any;
        lobbyState.transitionInto([waitingRoom.creatorId, waitingRoom.joinerId]);
    }
  }

  leave(playerId: string, input: string) {
    let result: LeaveResult = leaveLogic(this.waitingRooms, this.playerToWaitingRoom, playerId);

    //Handle leave output 
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

    //Handle leaving
    let currPlayer = this.playerDB.getPlayer(playerId)!;
    let roomId = this.playerToWaitingRoom.get(playerId)!
    let waitingRoom = this.waitingRooms.get(roomId)!;
    switch(result.decision) {
      case "leaveNotPresent":
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
      case "leaveCreatorNoJoiner":
        this.waitingRooms.delete(roomId);
        this.playerToWaitingRoom.delete(playerId);
        
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
      case "leaveCreatorJoiner":
        this.waitingRooms.delete(roomId);  
        
        //handle creator
        this.playerToWaitingRoom.delete(playerId);
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);

        //handle joiner
        this.playerToWaitingRoom.delete(waitingRoom.joinerId!);
        let gameSelectionState = this.stateMap.get("gameSelection")! as any;
        gameSelectionState.transitionInto(waitingRoom.joinerId);
        break;
      case "leaveJoiner":
        //handle joiner
        this.playerToWaitingRoom.delete(playerId);
        waitingRoom.joinerId = null;

        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);

        //handler creator 
        let creatorOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomCreator",
            data: {
              roomId
            }
          }
        }
        this.relayService.sendHandler(waitingRoom.creatorId, creatorOutput);
        break;
    }
  }

  rejoin(playerId: string) {
    let result: RejoinResult = rejoinLogic(this.waitingRooms, this.playerToWaitingRoom, playerId);

    let roomId: number; 
    let currentWaitingRoom: WaitingRoom;
    switch(result.decision) {
      case "creatorJoiner": 
        roomId = this.playerToWaitingRoom.get(playerId)!;
        currentWaitingRoom = this.waitingRooms.get(roomId)!;

        let creatorJoinerOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomCreator",
            data: {                    
              otherPlayerUsername: this.playerDB.getPlayer(currentWaitingRoom.joinerId!)!.username
            }
          }
        }
        this.relayService.sendHandler(currentWaitingRoom.creatorId, creatorJoinerOutput);
        break;
      case "creatorNoJoiner":
        roomId = this.playerToWaitingRoom.get(playerId)!;

        let creatorNoJoinerOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomCreator",
            data: {
              roomId: roomId
            }
          }
        }
        this.relayService.sendHandler(playerId, creatorNoJoinerOutput);
        break;   
      case "joinerJoined":
        roomId = this.playerToWaitingRoom.get(playerId)!;
        currentWaitingRoom = this.waitingRooms.get(roomId)!;

        let joinerJoinedOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomJoiner",
            data: {
              status: "joined",            
              otherPlayerUsername: this.playerDB.getPlayer(currentWaitingRoom.creatorId)!.username
            }
          }
        }
        this.relayService.sendHandler(playerId, joinerJoinedOutput);
        break;
      case "joinerNotJoined":
        let joinerNotJoinedOutput: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomJoiner",
            data: {
              status: "pending"
            }
          }
        };
        this.relayService.sendHandler(playerId, joinerNotJoinedOutput);
        break;
    }
  }

  temporaryLeave(playerId: string) {
    //Do nothing here
  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "privateWaitingRoomLeave":
        this.leave(playerId, inputContainer.input);
        break;
      case "privateWaitingRoomJoinerLeave":
        this.leave(playerId, inputContainer.input);
        break;
      case "privateWaitingRoomCreatorLeave":
        this.leave(playerId, inputContainer.input);
        break;
      case "join":
        this.join(playerId, inputContainer.input);
        break;
      case "kick":
        this.kick(playerId);
        break;
      case "startGame":
        this.startGame(playerId);
        break;
      default:
        //ignore
    }
  }
}
