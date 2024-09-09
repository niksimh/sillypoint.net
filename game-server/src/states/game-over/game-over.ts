import { winningStatement } from "../../game-engine/logic"
import { Game } from "../../game-engine/types"
import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service"
import { LeaveOutput } from "../../types"
import { State } from "../types"
import { transitionIntoLogic } from "./logic"
import { TransitionIntoResult } from "./types"

export default class GameOver {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService

  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.relayService = relayService
  }

  transitionInto(game: Game) {
    let result: TransitionIntoResult = transitionIntoLogic(game);
    
    let scoreboard = game.scoreboard!;
    let batterUsername = game.players[result.batterIndex].username;
    let bowerlerUsername = game.players[result.batterIndex].username;
    let winningStatementString = winningStatement(scoreboard, batterUsername, bowerlerUsername);

    let gameOverLeaveOutput: LeaveOutput = {
      type: "leave",
      outputContainer: {
        subType: "gameOver",
        data: {
          winningStatement: winningStatementString,
          winnerId: result.winnerId
        }
      }
    }
    this.relayService.sendHandler(game.players[0].playerId, gameOverLeaveOutput);
    this.relayService.sendHandler(game.players[1].playerId, gameOverLeaveOutput);
    
    //Delete players and disconnect their sockets
    this.playerDB.removePlayer(game.players[0].playerId);
    this.playerDB.removePlayer(game.players[1].playerId);

    let p1 = this.playerDB.getPlayer(game.players[0].playerId);
    p1 ? this.relayService.serverCloseHandler(p1.socket) : "";
    let p2 = this.playerDB.getPlayer(game.players[1].playerId);
    p2 ? this.relayService.serverCloseHandler(p2.socket) : "";
  }
  
}
