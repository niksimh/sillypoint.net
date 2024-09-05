import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service"
import { State } from "../types"
import { Game, ScoreboardContainer } from "../../game-engine/types"
import { TransitionIntoResult } from "./types"
import { transitionIntoLogic } from "./logic"
import { GameStateOutput } from "../../types"

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
    let tossOutput: GameStateOutput = {
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
    this.relayService.sendHandler(game.players[0].playerId, tossOutput);
    this.relayService.sendHandler(game.players[1].playerId, tossOutput);

    //Set timeout for cleanup
    game.timeout = setTimeout(() => this.computerMove(gameId), deadline + 1000);
  }


  computerMove(gameId: string) {}
 }
