import type PlayerDB from "../../player-db/player-db"
import type RelayService from "../../relay-service/relay-service"
import { State } from "../types"
import { leaveLogic } from "./logic";
import { LeaveResult, WaitingNode } from "./types"
import crypto from "crypto";

export default class PrivateWaitingRoom {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService
  waitingRooms: Map<number, WaitingNode>
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
        
        let newWaitingNode: WaitingNode = {
          creatorId: playerId
        }

        this.waitingRooms.set(roomId, newWaitingNode);
        this.playerToWaitingRoom.set(playerId, roomId);

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

  privateWaitingRoomLeave(playerId: string, input: string) {
    let result: LeaveResult = leaveLogic(this.waitingRooms, this.playerToWaitingRoom, playerId);

    let currPlayer = this.playerDB.getPlayer(playerId)!;
    let roomId = this.playerToWaitingRoom.get(playerId)!
    let room = this.waitingRooms.get(roomId)!;
    switch(result.decision) {
      case "leaveNotPresent":
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
      case "leaveCreatorNoJoiner":
        this.waitingRooms.delete(this.playerToWaitingRoom.get(playerId)!);
        this.playerToWaitingRoom.delete(playerId);
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
      case "leaveCreatorJoiner":
        //handle creator
        this.waitingRooms.delete(this.playerToWaitingRoom.get(playerId)!);
        this.playerToWaitingRoom.delete(playerId);
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);

        //handle joiner
        let gameSelectionState = this.stateMap.get("gameSelection")! as any;
        gameSelectionState.transitionInto(room.joinerId);
        break;
      case "leaveJoiner":
        this.playerToWaitingRoom.delete(playerId);
        room.joinerId = undefined;
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
    }
  }

  joinPrivateWaitingRoom(playerId: string, input: string) {

  }

  kickJoiner(playerId: string, input: string) {

  }

  inputHandler(playerId: string, inputContainer: { type: string, input: string }) {
    switch(inputContainer.type) {
      case "privateWaitingRoomLeave":
        this.privateWaitingRoomLeave(playerId, inputContainer.input);
        break;
      case "joinPrivateWaitingRoom":
        this.joinPrivateWaitingRoom(playerId, inputContainer.input);
        break;
      case "kick":
        this.kickJoiner(playerId, inputContainer.input);
        break;
      default:
        //ignore
    }
  }
}
