import { Game } from "../../game-engine/types"
import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service"
import { State } from "../types"
import { GameStateOutput } from "../../types"

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
     
    let deadline = Date.now() + (100 + 1000 + 10000);
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
    game.timeout = setTimeout(() => this.computerMove(gameId), deadline + 1000);
  }

  computerMove(gameId: string) {
    
  }
}
