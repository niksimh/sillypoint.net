import { Game, TossContainer } from "../../game-engine/types";
import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { InputContainer } from "../../types";
import { State } from "../types"
import { CompleteStateResult, ComputerMoveResult, PlayerMoveResult, TossOutput } from "./types";
import { completeStateLogic, computerMoveLogic, leaveLogic, playerMoveLogic } from "./logic";
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
        this.leave(playerId);
        break;
      case "partial":
        currGame.players[result.index].move = input;
        break;
      case "fulfillOther":
        let generateMove = crypto.randomInt(0, 7).toString();
        currGame.players[result.index].move = input;
        currGame.players[result.otherPlayerIndex].move = generateMove;
        clearTimeout(currGame.timeout);
        this.completeState(gameId);
        break;
      case "complete":
        currGame.players[result.index].move = input;
        clearTimeout(currGame.timeout);
        this.completeState(gameId);
        break;
    }
  }
  
  computerMove(gameId: string) {
    let currGame = this.currentGames.get(gameId)!;

    let result: ComputerMoveResult = computerMoveLogic(currGame);

    let generateMove1 = crypto.randomInt(0, 7).toString();
    let generateMove2 = crypto.randomInt(0, 7).toString();
    
    switch(result.decision) {
      case "0":
        currGame.players[0].move = generateMove1;
        break;
      case "1":
        currGame.players[1].move = generateMove2;
        break
      case "01":
        currGame.players[0].move = generateMove1;
        currGame.players[1].move = generateMove2;
    }
    this.completeState(gameId);
  }

  completeState(gameId: string) {
    let currGame = this.currentGames.get(gameId)!;
    let toss = currGame.toss!;

    let result: CompleteStateResult = completeStateLogic(currGame);

    switch(result.decision) {
      case "0":
        toss.winnerId = currGame.players[0].playerId;
        break;
      case "1":
        toss.winnerId = currGame.players[1].playerId;
    }

    //transition to next state
    let tossWinnerSelection = this.stateMap.get("tossWinnerSelection")! as any;
    tossWinnerSelection.transitionInto(gameId, currGame);
  }

  leave(playerId: string) {
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
        this.leave(playerId);
        break;
      case "tossPlayerMove":
        this.playerMove(playerId, inputContainer.input);
        break;
    }
  }
}
