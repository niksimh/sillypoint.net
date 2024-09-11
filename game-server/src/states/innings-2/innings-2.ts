import { Game } from "../../game-engine/types"
import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service"
import { State } from "../types"
import { GameStateOutput, LeaveOutput, InputContainer } from "../../types"
import crypto from "crypto"
import { PlayerMoveResult, ComputerMoveResult, CompleteStateResult, LeaveResult } from "./types"
import { playerMoveLogic, computerMoveLogic, completeStateLogic, leaveLogic, rejoinLogic, temporaryLeaveLogic} from "./logic"
import { isNoBall } from "../../game-engine/logic"


export default class Innings2 {
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
    p1 ? p1.status = "innings2" : "";
    let p2 = this.playerDB.getPlayer(game.players[1].playerId);
    p2 ? p2.status = "innings2" : "";

    //Transition game
    this.currentGames.set(gameId, game);

    //This innings is already set up, so you can simply transition
     
    let deadlineAmount = 100 + 1000 + 10000;
    let deadline = Date.now() + deadlineAmount;
    game.deadline = deadline;
    //Send innings2 output
    let innings2Output: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "innings1",
        data: {
          p1: { playerId: game.players[0].playerId, username: game.players[0].username },
          p2: { playerId: game.players[1].playerId, username: game.players[1].username },
          scoreboard: game.scoreboard
        }
      }
    }
    this.relayService.sendHandler(game.players[0].playerId, innings2Output);
    this.relayService.sendHandler(game.players[1].playerId, innings2Output);

    //Set timeout for cleanup
    game.timeout = setTimeout(() => this.computerMove(gameId), deadlineAmount + 1000);
  }

  playerMove(playerId: string, input: string) {
    let currentPlayer = this.playerDB.getPlayer(playerId)!;
    let gameId = currentPlayer.gameId!;
    let currentGame = this.currentGames.get(gameId)!;

    let result: PlayerMoveResult = playerMoveLogic(playerId, currentGame, input);

    switch(result.decision) {
      case "badInput":
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

    let generateMove1 = crypto.randomInt(1, 7).toString();
    let generateMove2 = crypto.randomInt(1, 7).toString();
    
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
      case "innings2Done":
        //Clear moves
        currentGame.players[0].move = null;
        currentGame.players[1].move = null;
    
        //Delete game from this state
        this.currentGames.delete(gameId);
    
        //Send game over to game over
        let gameOver = this.stateMap.get("gameOver")! as any;
        gameOver.transitionInto(gameId, currentGame);

        break;
      case null:
        currentGame.scoreboard = result.newScoreboard;

        //Null out moves 
        currentGame.players[0].move = null;
        currentGame.players[1].move = null;

        //Send new scoreboard 
        let deadline = Date.now() + (100 + 1000 + 10000);
        currentGame.deadline = deadline;
        let innings2Output: GameStateOutput = {
          type: "gameState",
          outputContainer: {
            subType: "innings2",
            data: {
              p1: { playerId: currentGame.players[0].playerId, username: currentGame.players[0].username },
              p2: { playerId: currentGame.players[1].playerId, username: currentGame.players[1].username },
              scoreboard: result.newScoreboard
            }
          }
        }
        this.relayService.sendHandler(currentGame.players[0].playerId, innings2Output);
        this.relayService.sendHandler(currentGame.players[1].playerId, innings2Output);

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

  rejoin(playerId: string) {
    let player = this.playerDB.getPlayer(playerId)!;
    let game = this.currentGames.get(player.gameId!)!;
      
    let result = rejoinLogic(playerId, game);

    game.players[result.index].goneOrTemporaryDisconnect = null;

    let innings1Output: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "innings1",
        data: {
          p1: { playerId: game.players[0].playerId, username: game.players[0].username },
          p2: { playerId: game.players[1].playerId, username: game.players[1].username },
          scoreboard: game.scoreboard
        }
      }
    }
    this.relayService.sendHandler(playerId, innings1Output);
  }

  temporaryLeave(playerId: string) {
    let player = this.playerDB.getPlayer(playerId)!;
    let game = this.currentGames.get(player.gameId!)!;
      
    let result = temporaryLeaveLogic(playerId, game);

    game.players[result.index].goneOrTemporaryDisconnect = "temporaryDisconnect";
  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "innings2Leave":
        this.leave(playerId, inputContainer.input);
        break;
      case "innings2PlayerMove":
        this.playerMove(playerId, inputContainer.input);
        break;
    }
  }
}
