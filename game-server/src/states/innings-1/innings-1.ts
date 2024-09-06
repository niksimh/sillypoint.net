import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service"
import { State } from "../types"
import { Game, ScoreboardContainer } from "../../game-engine/types"
import { TransitionIntoResult, PlayerMoveResult, ComputerMoveResult, CompleteStateResult, LeaveResult } from "./types"
import { transitionIntoLogic, playerMoveLogic, computerMoveLogic, completeStateLogic, leaveLogic } from "./logic"
import { GameStateOutput, InputContainer, LeaveOutput } from "../../types"
import crypto from "crypto";
import { isNoBall } from "../../game-engine/logic"

export default class Innings1 {
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
    let result: TransitionIntoResult = transitionIntoLogic(game);
    
    //Transition players
    let p1 = this.playerDB.getPlayer(game.players[0].playerId);
    p1 ? p1.status = "innings1" : "";
    let p2 = this.playerDB.getPlayer(game.players[1].playerId);
    p2 ? p2.status = "innings1" : "";

    //Transition game
    this.currentGames.set(gameId, game);

    //Setup toss variables
    let scoreboard: ScoreboardContainer = {
      batterId: game.players[result.decision].playerId,
      runs: 0,
      balls: 0,
      wickets: 0,
      last6: ["","","","","",""],
      target: null
     }
     game.scoreboard = scoreboard;
     
    let deadline = Date.now() + (100 + 1000 + 10000);
    //Send toss output
    let innings1Output: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "innings1",
        data: {
          p1: { playerId: game.players[0].playerId, username: game.players[0].username },
          p2: { playerId: game.players[1].playerId, username: game.players[1].username },
          scoreboard: scoreboard
        }
      }
    }
    this.relayService.sendHandler(game.players[0].playerId, innings1Output);
    this.relayService.sendHandler(game.players[1].playerId, innings1Output);

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

    let noBallRes = isNoBall();
    let result: CompleteStateResult = completeStateLogic(currentGame, noBallRes);

    switch(result.decision) {
      case "innings1Done":
        //Clear moves
        currentGame.players[0].move = null;
        currentGame.players[1].move = null;
    
        //Delete game from this state
        this.currentGames.delete(gameId);
    
        //Send game over to innings break
        let inningsBreak = this.stateMap.get("inningsBreak")! as any;
        inningsBreak.transitionInto(gameId, currentGame);

        break;
      case null:
        currentGame.scoreboard = result.newScoreboard;

        //Null out moves 
        currentGame.players[0].move = null;
        currentGame.players[1].move = null;

        //Send new scoreboard 
        let deadline = Date.now() + (100 + 1000 + 10000);
        
        let innings1Output: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "innings1",
            data: {
              p1: { playerId: currentGame.players[0].playerId, username: currentGame.players[0].username },
              p2: { playerId: currentGame.players[1].playerId, username: currentGame.players[1].username },
              scoreboard: result.newScoreboard
            }
          }
        }
        this.relayService.sendHandler(currentGame.players[0].playerId, innings1Output);
        this.relayService.sendHandler(currentGame.players[1].playerId, innings1Output);

        //Set timeout for cleanup
        currentGame.timeout = setTimeout(() => this.computerMove(gameId), deadline + 1000);
        
        break;
    }
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
      case "innings1Leave":
        this.leave(playerId, inputContainer.input);
        break;
      case "innings1PlayerMove":
        this.playerMove(playerId, inputContainer.input);
        break;
    }
  }
 }
