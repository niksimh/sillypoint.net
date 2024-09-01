import { Game } from "../../game-engine/types";
import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { TossWinnerSelectionOutput, PlayerMoveResult } from "./types";
import { playerMoveLogic } from "./logic";
import { State } from "../types"
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
    let tossOutput: TossWinnerSelectionOutput = {
      type: "gameState",
      state: "tossWinnerSelection",
      data: {
        p1: { playerId: game.players[0].playerId, username: game.players[0].username },
        p2: { playerId: game.players[1].playerId, username: game.players[1].username },
        winnerId: game.toss!.winnerId!,
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
      case "complete":
        currGame.players[result.index].move = input;
        clearTimeout(currGame.timeout);
        this.completeState(gameId);
        break;
    }
  }

  computerMove(gameId: string) {

  }

  
  completeState(gameId: string) {

  }

  leave(playerId: string) {

  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "tossWinnerSelectionLeave":
        this.leave(playerId);
        break;
      case "tossWinnerSelectionPlayerMove":
        this.playerMove(playerId, inputContainer.input);
        break;
    }
  }
}
