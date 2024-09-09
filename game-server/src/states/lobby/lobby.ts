import type PlayerDB from "../../player-db/player-db";
import { GameStateOutput, State } from "../types";
import type { Game } from "../../game-engine/types";
import type RelayService from "../../relay-service/relay-service";
import crypto from "crypto";
import { LeaveResult } from "./types";
import { InputContainer, LeaveOutput } from "../../types";
import { leaveLogic, temporaryLeaveLogic } from "./logic";

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
  
  transitionInto(players: string[]) {
    let newGameId = crypto.randomUUID();

    let newGame: Game;
    switch(players.length) {
      case 1:
        let dummyUsername = "Guest_" + crypto.randomInt(9999);

        newGame = {
          players: [
            { 
              playerId: players[0], 
              username: this.playerDB.getPlayer(players[0])!.username, 
              move: null,
              goneOrTemporaryDisconnect: null
             }, 
             {
              playerId: "#", //dummyId 
              username: dummyUsername, 
              move: null,
              goneOrTemporaryDisconnect: null
             }
          ],
          toss: null,
          scoreboard: null,
          timeout: null
        };

        let player = this.playerDB.getPlayer(players[0])!;
        player.status = "lobby";
        player.gameId = newGameId;
        break;
      default:
        newGame = {
          players: [
            { 
              playerId: players[0], 
              username: this.playerDB.getPlayer(players[0])!.username, 
              move: null,
              goneOrTemporaryDisconnect: null
             }, 
             {
              playerId: players[1], 
              username: this.playerDB.getPlayer(players[1])!.username, 
              move: null,
              goneOrTemporaryDisconnect: null
             }
          ],
          toss: null,
          scoreboard: null,
          timeout: null
        };
      let player1 = this.playerDB.getPlayer(players[0])!;
      let player2 = this.playerDB.getPlayer(players[1])!;
      player1.status = "lobby";
      player1.gameId = newGameId;
      player2.status = "lobby";
      player2.gameId = newGameId;
    }

    this.currentGames.set(newGameId, newGame);

    let lobbyOutput: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "lobby",
        data: {
          p1: { playerId: newGame.players[0].playerId, username: newGame.players[0].username },
          p2: { playerId: newGame.players[1].playerId, username: newGame.players[1].username }
        }
      }      
    };

    this.relayService.sendHandler(newGame.players[0].playerId, lobbyOutput);
    this.relayService.sendHandler(newGame.players[1].playerId, lobbyOutput);

    newGame.timeout = setTimeout(() => this.process(newGameId), 6000);
  }

  process(gameId: string) {
    let currentGame = this.currentGames.get(gameId)!

    //Delete game from this state
    this.currentGames.delete(gameId);

    //Send game over to toss
    let tossState = this.stateMap.get("toss")! as any;
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

    //Send leave output
    let leaveOutput: LeaveOutput = {
      type: "leave",
      outputContainer: {
        subType: "deliberate",
        data: {}
      }
    };
    this.relayService.sendHandler(currentGame.players[result.index].playerId, leaveOutput);
    
    //Handle leaving
    this.playerDB.removePlayer(playerId);
    this.relayService.serverCloseHandler(currentPlayer.socket);
  } 

  rejoin(playerId: string) {
    let player = this.playerDB.getPlayer(playerId)!;
    let game = this.currentGames.get(player.gameId!)!;
      
    let result = temporaryLeaveLogic(playerId, game);

    game.players[result.index].goneOrTemporaryDisconnect = null;

    let lobbyOutput: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "lobby",
        data: {
          p1: { playerId: game.players[0].playerId, username: game.players[0].username },
          p2: { playerId: game.players[1].playerId, username: game.players[1].username }
        }
      }      
    };

    this.relayService.sendHandler(playerId, lobbyOutput);
  }

  temporaryLeave(playerId: string) {
    let player = this.playerDB.getPlayer(playerId)!;
    let game = this.currentGames.get(player.gameId!)!;
      
    let result = temporaryLeaveLogic(playerId, game);

    game.players[result.index].goneOrTemporaryDisconnect = "temporaryDisconnect";
  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "lobbyLeave":
        this.leave(playerId, inputContainer.input);
        break;
      default:
        break;
        //ignore
    }
  }
}
