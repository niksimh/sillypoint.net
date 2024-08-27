import type PlayerDB from "../../player-db/player-db"
import type RelayService from "../../relay-service/relay-service";
import { State } from "../types"
import crypto from "crypto";
import { ConnectionResult } from "./types";
import { connectionLogic } from "./logic";
import type { WebSocket } from "ws";

export default class Connecting {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService

  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.relayService = relayService;
  }
  
  transitionInto(socket: WebSocket, requestUrl: string | undefined) {
    let startingSeqNumber = crypto.randomInt(1000);

    let result: ConnectionResult = connectionLogic(requestUrl, process.env.playerIdTokenSecret!);
    
    switch(result.decision) {
      case "add":
        let newPlayer = {
          username: result.username,
          socket: socket,
          status: "connecting"
        }
        this.playerDB.addPlayer(result.playerId, newPlayer);
        
        (socket as any).playerId = result.playerId;
        (socket as any).seqNumber = startingSeqNumber;
        
        socket.send(JSON.stringify({
          type: "seqNumber",
          seqNumber: startingSeqNumber
        }));

        let gameSelectionState = this.stateMap.get("gameSelection") as any;
        gameSelectionState.transitionInto(result.playerId);

        break;
      case "terminate":
        this.relayService.closeFromSocket(socket);
    }
  }

}
