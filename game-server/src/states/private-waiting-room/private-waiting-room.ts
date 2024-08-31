import type PlayerDB from "../../player-db/player-db"
import type RelayService from "../../relay-service/relay-service"
import { InputContainer } from "../../types";
import { State } from "../types"
import { joinLogic, kickLogic, leaveLogic, startGameLogic } from "./logic";
import { JoinResult, KickResult, LeaveResult, StartGameResult, WaitingNode } from "./types"
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

        this.relayService.sendHandler(playerId, JSON.stringify({
            gameState: "privateWaitingRoomCreator",
            data: {
              roomId
            }
        }));
        break;
      case "joiner":
        this.relayService.sendHandler(playerId, JSON.stringify({
          gameState: "privateWaitingRoomJoiner",
          data: {}
        }));
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
        this.waitingNodes.delete(this.playerToWaitingNode.get(playerId)!);
        this.playerToWaitingNode.delete(playerId);
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
      case "leaveCreatorJoiner":
        //handle creator
        this.waitingNodes.delete(this.playerToWaitingNode.get(playerId)!);
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
        this.relayService.sendHandler(playerId, JSON.stringify({
          gameState: "privateWaitingRoomJoiner",
          data: {
            status: "badRoom"
          }
        }));
        break;
      case "fullRoom":
        this.relayService.sendHandler(playerId, JSON.stringify({
          gameState: "privateWaitingRoomJoiner",
          data: {
            status: "fullRoom"
          }
        }));
        break;
      case "succesful":
        this.playerToWaitingNode.set(playerId, Number(input));
        
        let currWaitingNode = this.waitingNodes.get(Number(input))!
        currWaitingNode.joinerId = playerId;

        this.relayService.sendHandler(playerId, JSON.stringify({
          gameState: "privateWaitingRoomJoiner",
          data: {
            status: "joined",
            otherPlayerId: currWaitingNode.creatorId,
            otherPlayerUsername: this.playerDB.getPlayer(currWaitingNode.creatorId)!.username
          }
        }));

        this.relayService.sendHandler(currWaitingNode.creatorId, JSON.stringify({
          gameState: "privateWaitingRoomCreator",
          data: {
            status: "joined",
            otherPlayerId: currWaitingNode.joinerId,
            otherPlayerUsername: this.playerDB.getPlayer(currWaitingNode.joinerId)!.username
          }
        }));
        break;
    }
  }

  kick(playerId: string, input: string) {
    let result: KickResult = kickLogic(this.waitingNodes, this.playerToWaitingNode, playerId);

    let newRoomId = crypto.randomInt(1000, 10000);
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
        let currRoomId = this.playerToWaitingNode.get(playerId)!
        let waitingNode = this.waitingNodes.get(currRoomId)!;
        let joinerId = waitingNode.joinerId!;

        this.playerToWaitingNode.set(playerId, newRoomId);
        this.waitingNodes.delete(currRoomId);
        this.waitingNodes.set(newRoomId, { creatorId: playerId });

        this.relayService.sendHandler(playerId, JSON.stringify({
          gameState: "privateWaitingRoomCreator",
          data: {
            roomId: newRoomId
          }
        }));

        let gameSelectionState = this.stateMap.get("gameSelectionState")! as any;
        gameSelectionState.transitionInto(playerId);
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
        this.kick(playerId, inputContainer.input);
        break;
      case "startGame":
        this.startGame(playerId);
        break;
      default:
        //ignore
    }
  }
}
