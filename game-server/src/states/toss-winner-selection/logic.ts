import { Game } from "../../game-engine/types";
import { 
  CompleteStateResult, 
  ComputerMoveResult, 
  PlayerMoveResult, 
  LeaveResult } from "./types";

export function playerMoveLogic(playerId: string, game: Game, input: string): PlayerMoveResult {
  if (input !== "bat" && input !== "bowl") {
    return { decision: "badMove" };
  }

  let tossContainer = game.toss!;
  if (tossContainer.winnerId !== playerId) {
    return { decision: "badMove" };
  }

  let players = game.players;

  if (players[0].playerId === playerId) {
    if(players[0].move !== null) {
      return { decision: "badMove" };
    }
    return { decision: "complete", index: 0};
  }

  if(players[1].move !== null) {
    return { decision: "badMove" };
  }
  return { decision: "complete", index: 1};
}

export function computerMoveLogic(game: Game): ComputerMoveResult {
  let players = game.players;
  let tossContainer = game.toss!;
  let tossWinnerId = tossContainer.winnerId!;
  
  if (players[0].playerId === tossWinnerId) {
    return { decision: "0" };
  }
  return { decision: "1" };
}

export function completeStateLogic(game: Game): CompleteStateResult {
  let players = game.players;
  let tossContainer = game.toss!;
  let tossWinnerId = tossContainer.winnerId!;
  
  if (players[0].playerId === tossWinnerId) {
    return { decision: "0" };
  }
  return { decision: "1" };
}

export function leaveLogic(playerId: string, game: Game): LeaveResult {
  let players = game.players;

  if(players[0].playerId === playerId) {
    if (players[1].playerId === "#" || players[1].goneOrTemporaryDisconnect === "gone") {
      return { decision: "noOneLeft", index: 0 }
    }
    return { decision: "oneLeft", index: 0 };
  }

  if (players[0].goneOrTemporaryDisconnect === "gone") {
    return { decision: "noOneLeft", index: 1 };
  } else {
    return { decision: "oneLeft", index: 1 };
  }
}