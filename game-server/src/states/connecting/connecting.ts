import { WebSocket } from "ws";

import PlayerDB from "@/player-db/player-db"

import RelayService from "@/relay-service/relay-service";

import { State } from "@/states/types"

import { transitionIntoLogic } from "@/states/connecting/logic";

import { LeaveOutput } from "@/types";

export default class Connecting {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService

  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.relayService = relayService;
  }
  
  transitionInto(playerId: string, username: string, socket: WebSocket) {
    let player = this.playerDB.getPlayer(playerId);

    let result = transitionIntoLogic(player);
    
    switch(result.decision) {
      case "close":
        let leaveOutput: LeaveOutput = {
          type: "leave",
          outputContainer: {
            subType: "badConnectionRequest",
            data: {}
          }
        }
        socket.send(JSON.stringify(leaveOutput));
        socket.close();
        break;
      case "add":
        let newPlayer = {
          username: username,
          socket: socket,
          status: "connecting",
          timeout: setTimeout(() => this.socketTimeout(playerId), 900000)
        };
        this.playerDB.addPlayer(playerId, newPlayer);
              
        let gameSelectionState = this.stateMap.get("gameSelection") as any;
        gameSelectionState.transitionInto(playerId);
        break;
      case "rejoin":
        player!.socket = socket;
        let currentState = this.stateMap.get(player!.status) as any;
        currentState.rejoin(playerId);
    }
  }

  socketTimeout(playerId: string) {
    let player = this.playerDB.getPlayer(playerId);
    let currentState = this.stateMap.get(player!.status) as any;
    currentState.leave(playerId, "timeout");
  }
}
