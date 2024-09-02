import type PlayerDB from "../../player-db/player-db"
import type RelayService from "../../relay-service/relay-service"
import { InputContainer } from "../../types";
import { State } from "../types"
import { joinLogic, kickLogic, leaveLogic, startGameLogic } from "./logic";
import { 
  JoinResult, 
  KickResult, 
  LeaveResult, 
  StartGameResult, 
  WaitingNode,
  PrivateWaitingRoomCreatorNoJoinerOutput,
  PrivateWaitingRoomCreatorJoinerOutput,
  PrivateWaitingRoomJoinerPreJoinOutput,
  PrivateWaitingRoomJoinerJoinedOutput
 } from "./types"
import crypto from "crypto";

export default class PrivateWaitingRoom {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService
  waitingNodes: Map<number, WaitingNode>
  playerToWaitingNode: Map<string, number>

  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.relayService = relayService;
    this.waitingNodes = new Map();
    this.playerToWaitingNode = new Map;
  }

  transitionInto(playerId: string, position: "creator" | "joiner") {
    let currPlayer = this.playerDB.getPlayer(playerId)!;

    currPlayer.status = "privateWaitingRoom";

    switch(position) {
      case "creator":
        let roomId = crypto.randomInt(1000, 10000);
        
        let newWaitingNode: WaitingNode = {
          creatorId: playerId
        }

        this.waitingNodes.set(roomId, newWaitingNode);
        this.playerToWaitingNode.set(playerId, roomId);

        let creatorOutput: PrivateWaitingRoomCreatorNoJoinerOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomCreator",
            data: {
              roomId
            }
          }
        }
        this.relayService.sendHandler(playerId, creatorOutput);
        break;
      case "joiner":
        let joinerOutput: PrivateWaitingRoomJoinerPreJoinOutput = {
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

  privateWaitingRoomLeave(playerId: string) {
    let result: LeaveResult = leaveLogic(this.waitingNodes, this.playerToWaitingNode, playerId);

    let currPlayer = this.playerDB.getPlayer(playerId)!;
    let roomId = this.playerToWaitingNode.get(playerId)!
    let room = this.waitingNodes.get(roomId)!;
    switch(result.decision) {
      case "leaveNotPresent":
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
      case "leaveCreatorNoJoiner":
        this.waitingNodes.delete(roomId);
        this.playerToWaitingNode.delete(playerId);
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
      case "leaveCreatorJoiner":
        //handle creator
        this.waitingNodes.delete(roomId);
        this.playerToWaitingNode.delete(playerId);
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);

        //handle joiner
        let gameSelectionState = this.stateMap.get("gameSelection")! as any;
        gameSelectionState.transitionInto(room.joinerId);
        break;
      case "leaveJoiner":
        this.playerToWaitingNode.delete(playerId);
        room.joinerId = undefined;
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);

        //handler creator 
        let pwrcnjo: PrivateWaitingRoomCreatorNoJoinerOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomCreator",
            data: {
              roomId
            }
          }
        }
        this.relayService.sendHandler(room.creatorId, pwrcnjo);
        break;
    }
  }

  join(playerId: string, input: string) {
    let result: JoinResult = joinLogic(this.waitingNodes, this.playerToWaitingNode, playerId, input);

    switch(result.decision) {
      case "present":
        this.privateWaitingRoomLeave(playerId);
        break;
      case "badInput":
        this.privateWaitingRoomLeave(playerId);
        break;
      case 'badRoom':
        let badRoomOutput: PrivateWaitingRoomJoinerPreJoinOutput = {
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
        let fullRoomOutput: PrivateWaitingRoomJoinerPreJoinOutput = {
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
        this.playerToWaitingNode.set(playerId, roomId);
        
        let currWaitingNode = this.waitingNodes.get(roomId)!
        currWaitingNode.joinerId = playerId;

        //Output to joiner
        let joinerJoinedOutput: PrivateWaitingRoomJoinerJoinedOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomJoiner",
            data: {
              roomId,
              otherPlayerId: currWaitingNode.creatorId,
              otherPlayerUsername: this.playerDB.getPlayer(currWaitingNode.creatorId)!.username
            }
          }
        }
        this.relayService.sendHandler(playerId, joinerJoinedOutput);

        //Output to creator
        let creatorOutput: PrivateWaitingRoomCreatorJoinerOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomCreator",
            data: {
              roomId,
              otherPlayerId: currWaitingNode.joinerId,
              otherPlayerUsername: this.playerDB.getPlayer(currWaitingNode.joinerId)!.username
            }
          }
        }
        this.relayService.sendHandler(currWaitingNode.creatorId, creatorOutput);
        break;
    }
  }

  kick(playerId: string) {
    let result: KickResult = kickLogic(this.waitingNodes, this.playerToWaitingNode, playerId);

    switch(result.decision) {
      case "notPresent":
        this.privateWaitingRoomLeave(playerId);
        break;
      case "notCreator":
        this.privateWaitingRoomLeave(playerId);
        break;
      case "empty":
        this.privateWaitingRoomLeave(playerId);
        break;
      case "successful":
        let newRoomId = crypto.randomInt(1000, 10000);
        let currRoomId = this.playerToWaitingNode.get(playerId)!
        let waitingNode = this.waitingNodes.get(currRoomId)!;
        let joinerId = waitingNode.joinerId!;

        this.playerToWaitingNode.set(playerId, newRoomId);
        this.playerToWaitingNode.delete(joinerId);
        this.waitingNodes.delete(currRoomId);
        this.waitingNodes.set(newRoomId, { creatorId: playerId });

        //Creator output 
        let creatorOutput: PrivateWaitingRoomCreatorNoJoinerOutput = {
          type: "gameState",
          outputContainer: {
            subType: "privateWaitingRoomCreator",
            data: {
              roomId: newRoomId
            }
          }
        }
        this.relayService.sendHandler(playerId, creatorOutput);

        //Transition joiner back to gameSelection
        let gameSelectionState = this.stateMap.get("gameSelection")! as any;
        gameSelectionState.transitionInto(joinerId);
    }
  }

  startGame(playerId: string) {
    let result: StartGameResult = startGameLogic(this.waitingNodes, this.playerToWaitingNode, playerId);

    switch(result.decision) {
      case "notPresent":
        this.privateWaitingRoomLeave(playerId);
        break;
      case "notCreator":
        this.privateWaitingRoomLeave(playerId);
        break;
      case "noJoiner":
        this.privateWaitingRoomLeave(playerId);
        break;
      case "successful":
        let roomId = this.playerToWaitingNode.get(playerId)!;
        let waitingNode = this.waitingNodes.get(roomId)!;

        this.playerToWaitingNode.delete(waitingNode.creatorId);
        this.playerToWaitingNode.delete(waitingNode.joinerId!);
        this.waitingNodes.delete(roomId);

        let lobbyState = this.stateMap.get("lobby")! as any;
        lobbyState.transitionInto(waitingNode.creatorId, waitingNode.joinerId);
    }
  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "privateWaitingRoomLeave":
        this.privateWaitingRoomLeave(playerId);
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
