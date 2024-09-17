import PlayerDB from "@/player-db/player-db";
import RelayService from "@/relay-service/relay-service";

import { Game } from "@/game-engine/types";

import { State } from "@/states/types";

import { GameStateOutput, LeaveOutput, InputContainer } from "@/types";

import { transitionIntoLogic, leaveLogic, rejoinLogic, temporaryLeaveLogic } from "@/states/innings-break/logic";

export default class InningsBreak {
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
    p1 ? p1.status = "inningsBreak" : "";
    let p2 = this.playerDB.getPlayer(game.players[1].playerId);
    p2 ? p2.status = "inningsBreak" : "";

    //Set current game
    this.currentGames.set(gameId, game);

    let result = transitionIntoLogic(game);

    //Update scoreboard in game
    game.scoreboard = result.nextScoreboard

    //Send output
    let inningsBreakOutput: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "inningsBreak",
        data: {
          p1: { playerId: game.players[0].playerId, username: game.players[0].username },
          p2: { playerId: game.players[1].playerId, username: game.players[1].username },
          nextBatterId: result.nextScoreboard.batterId,
          target: result.nextScoreboard.target
        }
      }
    }
    this.relayService.sendHandler(game.players[0].playerId, inningsBreakOutput);
    this.relayService.sendHandler(game.players[1].playerId, inningsBreakOutput);

    //Setup timer
    game.timeout = setTimeout(() => this.process(gameId), 6000);
  }

  process(gameId: string) {
    let currentGame = this.currentGames.get(gameId)!

    //Delete game from this state
    this.currentGames.delete(gameId);

    //Send game over to toss
    let innings2State = this.stateMap.get("innings2")! as any;
    innings2State.transitionInto(gameId, currentGame);
  }

  leave(playerId: string, input: string) {
    let currentPlayer = this.playerDB.getPlayer(playerId)!
    let gameId = currentPlayer.gameId!;
    let currentGame = this.currentGames.get(gameId)!;

    let result = leaveLogic(playerId, currentGame);

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

    let inningsBreakOutput: GameStateOutput = {
      type: "gameState",
      outputContainer: {
        subType: "inningsBreak",
        data: {
          p1: { playerId: game.players[0].playerId, username: game.players[0].username },
          p2: { playerId: game.players[1].playerId, username: game.players[1].username },
          nextBatterId: game.scoreboard?.batterId,
          target: game.scoreboard?.target,
        }
      }
    }
    this.relayService.sendHandler(playerId, inningsBreakOutput);
  }

  temporaryLeave(playerId: string) {
    let player = this.playerDB.getPlayer(playerId)!;
    let game = this.currentGames.get(player.gameId!)!;
      
    let result = temporaryLeaveLogic(playerId, game);

    game.players[result.index].goneOrTemporaryDisconnect = "temporaryDisconnect";
  }

  inputHandler(playerId: string, inputContainer: InputContainer) {
    switch(inputContainer.type) {
      case "inningsBreakLeave":
        this.leave(playerId, inputContainer.input);
        break;
      default:
        break;
        //ignore
    }
  }
}
