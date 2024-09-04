import { Game } from "../../game-engine/types";
import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { TossWinnerSelectionOutput, PlayerMoveResult, ComputerMoveResult } from "./types";
import { playerMoveLogic, computerMoveLogic } from "./logic";
import { GameStateOutput, State } from "../types"
import { InputContainer } from "../../types";

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

    let deadline = Date.now() + (100 + 1000 + 10000);
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

  }

  leave(playerId: string, input: string) {

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
