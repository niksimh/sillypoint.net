import { Game, TossContainer } from "../../game-engine/types";
import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { InputContainer } from "../../types";
import { State } from "../types"
import { PlayerMoveResult, TossOutput } from "./types";
import { leaveLogic, playerMoveLogic } from "./logic";
import { LeaveResult } from "./types";
import crypto from "crypto";

export default class Toss {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService
  currentGames: Map<string, Game>


  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.relayService = relayService;
    this.currentGames = new Map();
  }
 
  transitionInto(gameId: string, game: Game) {
    //Transition players
    let p1 = this.playerDB.getPlayer(game.players[0].playerId);
    p1 ? p1.status = "toss" : "";
    let p2 = this.playerDB.getPlayer(game.players[1].playerId);
    p2 ? p2.status = "toss" : "";

    //Transition game
    this.currentGames.set(gameId, game);

    //Setup toss variables
    let toss: TossContainer = {
      evenId: (Math.random() > 0.5) ? game.players[0].playerId : game.players[1].playerId,
      winnerId: null
     }
     game.toss = toss;
     
    let deadline = Date.now() + (100 + 1000 + 1000);
    //Send out 
    let tossOutput: TossOutput = {
      type: "gameState",
      state: "toss",
      data: {
        p1: { playerId: game.players[0].playerId, username: game.players[0].username },
        p2: { playerId: game.players[1].playerId, username: game.players[1].username },
        evenId: toss.evenId,
        deadline: deadline
      }
    }


    this.relayService.sendHandler(game.players[0].playerId, JSON.stringify(tossOutput));
    this.relayService.sendHandler(game.players[1].playerId, JSON.stringify(tossOutput));

    game.timeout = setTimeout(() => this.computerMove(gameId), deadline + 1000);
  
  }

  playerMove(playerId: string, input: string) {
    let currPlayer = this.playerDB.getPlayer(playerId)!;
    let gameId = currPlayer.gameId!;
    let currGame = this.currentGames.get(gameId)!;

    let result: PlayerMoveResult = playerMoveLogic(playerId, currGame, input);

    switch(result.decision) {
      case "badMove":
        this.tossLeave(playerId);
        break;
      case "partial":
        currGame.players[result.index].move = input;
        break;
      case "fulfillOther":
        let generateMove = crypto.randomInt(0, 7).toString();
        currGame.players[result.index].move = input;
        currGame.players[result.otherPlayerIndex].move = generateMove;
        this.completeState(gameId);
        break;
      case "complete":
        currGame.players[result.index].move = input;
        this.completeState(gameId);
        break;
    }
  }
  
  computerMove(gameId: string) {
    
  }

  completeState(gameId: string) {

  }

  tossLeave(playerId: string) {
    let currPlayer = this.playerDB.getPlayer(playerId)!
    let gameId = currPlayer.gameId!;
    let currGame = this.currentGames.get(gameId)!;

    let result: LeaveResult = leaveLogic(playerId, currGame);

    switch(result.decision) {
      case "oneLeft":
        currGame.players[result.index].goneOrTemporaryDisconnect = "gone";
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
      case "noOneLeft":
        clearTimeout(currGame.timeout);
        this.currentGames.delete(gameId);
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
    }
  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "tossLeave":
        this.tossLeave(playerId);
        break;
      case "playerMove":
        this.playerMove(playerId, inputContainer.input);
        break;
    }
  }
}
