import type PlayerDB from "../../player-db/player-db";
import { State } from "../types";
import type { Game } from "../../game-engine/types";
import type RelayService from "../../relay-service/relay-service";
import crypto from "crypto";
import { LeaveResult, LobbyOutput } from "./types";
import { InputContainer } from "../../types";
import { leaveLogic } from "./logic";

export default class Lobby {
  stateMap: Map<string, State>
  playerDB: PlayerDB
  relayService: RelayService
  currentGames: Map<string, Game>

  constructor(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
    this.stateMap = stateMap;
    this.playerDB = playerDB;
    this.relayService = relayService
    this.currentGames = new Map();
  }
  
  transitionInto(player1Id: string, player2Id?: string) {
    let newGameId = crypto.randomUUID();

    let newGame: Game = {
      players: [
        { playerId: player1Id, username: this.playerDB.getPlayer(player1Id)!.username }
      ],
      toss: null,
      scoreboard: null
    }
    
    let p1Player = this.playerDB.getPlayer(player1Id)!;
    p1Player.status = "lobby";
    p1Player.gameId = newGameId;

    switch(player2Id) {
      case undefined:
        let dummyUsername = "Guest_" + crypto.randomInt(9999);
        newGame.players.push({playerId: "#", username: dummyUsername}) //dummy player
        break;
      default:
        let p2Player = this.playerDB.getPlayer(player2Id)!;
        p2Player.status = "lobby";
        p1Player.gameId = newGameId;

        let p2 =  { playerId: player2Id, username: this.playerDB.getPlayer(player2Id)!.username }
        newGame.players.push(p2);
        break;
    }

    this.currentGames.set(newGameId, newGame);

    let output: LobbyOutput = {
      type: "gameState",
      state: "lobby",
      data: {
        p1: { playerId: newGame.players[0].playerId, username: newGame.players[0].username },
        p2: { playerId: newGame.players[1].playerId, username: newGame.players[1].username }
      }
    }

    this.relayService.sendHandler(newGame.players[0].playerId, JSON.stringify(output));
    this.relayService.sendHandler(newGame.players[1].playerId, JSON.stringify(output));

    setTimeout(() => this.process(newGameId));
  }

  process(gameId: string) {
    this.currentGames.delete(gameId);
    let tossState = this.stateMap.get("toss")! as any;
    tossState.transitionInto(gameId);
  }

  lobbyLeave(playerId: string) {
    let currPlayer = this.playerDB.getPlayer(playerId)!
    let gameId = currPlayer.gameId!;
    let currGame = this.currentGames.get(gameId)!;

    let result: LeaveResult = leaveLogic(playerId, currGame);

    switch(result.decision) {
      case "oneLeft":
        currGame.players.splice(result.index, 1);
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
      case "noOneLeft":
        this.currentGames.delete(gameId);
        this.playerDB.removePlayer(playerId);
        this.relayService.serverCloseHandler(currPlayer.socket);
        break;
    }
  } 

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "lobbyLeave":
        this.lobbyLeave(playerId);
        break;
      default:
        break;
        //ignore
    }
  }
}
