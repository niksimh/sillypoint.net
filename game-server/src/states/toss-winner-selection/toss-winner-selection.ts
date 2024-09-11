import { Game } from "../../game-engine/types";
import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { PlayerMoveResult, ComputerMoveResult, LeaveResult } from "./types";
import { playerMoveLogic, computerMoveLogic, leaveLogic, rejoinLogic, temporaryLeaveLogic } from "./logic";
import { GameStateOutput, State } from "../types"
import { InputContainer, LeaveOutput } from "../../types";

export default class TossWinnerSelection {
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
    p1 ? p1.status = "tossWinnerSelection" : "";
    let p2 = this.playerDB.getPlayer(game.players[1].playerId);
    p2 ? p2.status = "tossWinnerSelection" : "";

    //Transition game
    this.currentGames.set(gameId, game)

    let turnTime;
    game.toss!.winnerId! === "#" ? turnTime = 4000 : turnTime = 10000;
  
    let deadlineAmount = 100 + 1000 + turnTime;
    let deadline = Date.now() + deadlineAmount;
    game.deadline = deadline;

    //Send out result
    let tossOutput: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "tossWinnerSelection",
        data: {
          p1: { playerId: game.players[0].playerId, username: game.players[0].username },
          p2: { playerId: game.players[1].playerId, username: game.players[1].username },          
          winnerId: game.toss!.winnerId!,
          deadline: deadline
        }
      }
    }

    this.relayService.sendHandler(game.players[0].playerId, tossOutput);
    this.relayService.sendHandler(game.players[1].playerId, tossOutput);

    game.timeout = setTimeout(() => this.computerMove(gameId), deadlineAmount + 1000);
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
      case "complete":
        currentGame.players[result.index].move = input;
        clearTimeout(currentGame.timeout!);
        this.completeState(gameId);
        break;
    }
  }

  computerMove(gameId: string) {
    let currentGame = this.currentGames.get(gameId)!;

    let result: ComputerMoveResult = computerMoveLogic(currentGame);
    
    switch(result.decision) {
      case "0":
        currentGame.players[0].move = Math.random() > 0.5 ? "bat" : " bowl";
        break;
      case "1":
        currentGame.players[1].move = Math.random() > 0.5 ? "bat" : " bowl";
        break;
    }
    this.completeState(gameId);
  }

  completeState(gameId: string) {
    let currentGame = this.currentGames.get(gameId)!;
    
    let result: ComputerMoveResult = computerMoveLogic(currentGame);
    
    let tossContainer = currentGame.toss!;
    switch(result.decision) {
      case "0":
        tossContainer.winnerSelection = currentGame.players[0].move as ("bat" | "bowl");
        break;
      case "1":
        tossContainer.winnerSelection = currentGame.players[1].move as ("bat" | "bowl");
        break;
    }
    
    //Clear moves
    currentGame.players[0].move = null;
    currentGame.players[1].move = null;

    //Delete game from this state
    this.currentGames.delete(gameId);

    //Send game over to innings1
    let innings1State = this.stateMap.get("innings1")! as any;
    innings1State.transitionInto(gameId, currentGame);
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

    let tossWinnerSelectionOutput: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "tossWinnerSelection",
        data: {
          p1: { playerId: game.players[0].playerId, username: game.players[0].username },
          p2: { playerId: game.players[1].playerId, username: game.players[1].username },
          winnerId: game.toss!.winnerId!,
          deadline: game.deadline
        }
      }
    }

    this.relayService.sendHandler(playerId, tossWinnerSelectionOutput);
  }

  temporaryLeave(playerId: string) {
    let player = this.playerDB.getPlayer(playerId)!;
    let game = this.currentGames.get(player.gameId!)!;
      
    let result = temporaryLeaveLogic(playerId, game);

    game.players[result.index].goneOrTemporaryDisconnect = "temporaryDisconnect";
  }
  
  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "tossWinnerSelectionLeave":
        this.leave(playerId, inputContainer.input);
        break;
      case "tossWinnerSelectionPlayerMove":
        this.playerMove(playerId, inputContainer.input);
        break;
    }
  }
}
