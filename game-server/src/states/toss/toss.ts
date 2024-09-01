import { Game, TossContainer } from "../../game-engine/types";
import type PlayerDB from "../../player-db/player-db"
import RelayService from "../../relay-service/relay-service";
import { State } from "../types"
import { TossOutput } from "./types";

export default class Toss {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService
  currGames: Map<string, Game>


  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.relayService = relayService;
    this.currGames = new Map();
  }
 
  transitionInto(gameId: string, game: Game) {
    //Transition players
    let p1 = this.playerDB.getPlayer(game.players[0].playerId);
    p1 ? p1.status = "toss" : "";
    let p2 = this.playerDB.getPlayer(game.players[1].playerId);
    p2 ? p2.status = "toss" : "";

    //Transition game
    this.currGames.set(gameId, game);

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

  computerMove(gameId: string) {
    
  }
}
