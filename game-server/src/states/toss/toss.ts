import { Game, TossContainer } from "../../game-engine/types";
import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { GameStateOutput, InputContainer, LeaveOutput } from "../../types";
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
      winnerId: null,
      winnerSelection: null
     }
     game.toss = toss;
     

    let deadline = Date.now() + (100 + 1000 + 1000);
    //Send toss output
    let tossOutput: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "toss",
        data: {
          p1: { playerId: game.players[0].playerId, username: game.players[0].username },
          p2: { playerId: game.players[1].playerId, username: game.players[1].username },
          evenId: toss.evenId,
          deadline: deadline
        }
      }
    }
    this.relayService.sendHandler(game.players[0].playerId, tossOutput);
    this.relayService.sendHandler(game.players[1].playerId, tossOutput);

    //Set timeout for cleanup
    game.timeout = setTimeout(() => this.computerMove(gameId), deadline + 1000);
  
  }

  playerMove(playerId: string, input: string) {
    let currentPlayer = this.playerDB.getPlayer(playerId)!;
    let gameId = currentPlayer.gameId!;
    let currentGame = this.currentGames.get(gameId)!;

    let result: PlayerMoveResult = playerMoveLogic(playerId, currentGame, input);

    switch(result.decision) {
      case "badMove":
        this.leave(playerId, "badInput");
        break;
      case "partial":
        currentGame.players[result.index].move = input;
        break;
      case "fulfillOther":
        let generateMove = crypto.randomInt(0, 7).toString();
        currentGame.players[result.index].move = input;
        currentGame.players[result.otherPlayerIndex].move = generateMove;
        clearTimeout(currentGame.timeout!);
        this.completeState(gameId);
        break;
      case "complete":
        currentGame.players[result.index].move = input;
        clearTimeout(currentGame.timeout!);
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
    let currentGame = this.currentGames.get(gameId)!;
    let toss = currentGame.toss!;

    let result: CompleteStateResult = completeStateLogic(currentGame);

    switch(result.decision) {
      case "0":
        toss.winnerId = currentGame.players[0].playerId;
        break;
      case "1":
        toss.winnerId = currentGame.players[1].playerId;
    }

    //Clear moves
    currentGame.players[0].move = null;
    currentGame.players[0].move = null;

    //Delete game from this state
    this.currentGames.delete(gameId);

    //Send game over to toss
    let tossState = this.stateMap.get("tossWinnerSelection")! as any;
    tossState.transitionInto(gameId, currentGame);
  }

  leave(playerId: string, input: string) {
    let currentPlayer = this.playerDB.getPlayer(playerId)!
    let gameId = currentPlayer.gameId!;
    let currentGame = this.currentGames.get(gameId)!;

    let result: LeaveResult = leaveLogic(playerId, currentGame);

    switch(result.decision) {
      case "oneLeft":
        currentGame.players[result.index].goneOrTemporaryDisconnect = "gone";
        break;
      case "noOneLeft":
        clearTimeout(currentGame.timeout!);
        this.currentGames.delete(gameId);
        break;
    }

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
    this.playerDB.removePlayer(playerId);
    this.relayService.serverCloseHandler(currentPlayer.socket);
  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "tossLeave":
        this.leave(playerId, inputContainer.input);
        break;
      case "tossPlayerMove":
        this.playerMove(playerId, inputContainer.input);
        break;
    }
  }
}
