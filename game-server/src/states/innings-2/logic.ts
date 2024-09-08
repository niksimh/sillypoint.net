import { endOfInnings, processBall } from "../../game-engine/logic";
import { Game } from "../../game-engine/types";
import { 
  ComputerMoveResult, 
  PlayerMoveResult, 
  CompleteStateResult,
  LeaveResult
 } from "./types";

export function playerMoveLogic(playerId: string, game: Game, move: string): PlayerMoveResult {
  let numberMove = Number(move);
  if (!Number.isInteger(numberMove) || numberMove < 1 || numberMove > 6) {
    return { decision: "badInput" };
  }

  let players = game.players;

  if (players[0].playerId === playerId) {
    if (players[0].move !== null) {
      return { decision: "badInput" };
    }
    if(players[1].move !== null) {
      return { decision: "complete", index: 0 };
    }
    if (players[1].playerId === "#" || players[1].goneOrTemporaryDisconnect) {
      return { decision: "fulfillOther", index: 0, otherPlayerIndex: 1 };
    }

    return { decision: "partial", index: 0 }
  }


  if (players[1].move !== null) {
    return { decision: "badInput" };
  }
  if(players[0].move !== null) {
    return { decision: "complete", index: 1 };
  }
  if (players[0].goneOrTemporaryDisconnect) {
    return { decision: "fulfillOther", index: 1, otherPlayerIndex: 0 };
  }

  return { decision: "partial", index: 1 };
}

export function computerMoveLogic(game: Game): ComputerMoveResult {
  let players = game.players;

  if (players[0].move === null && players[1].move === null) {
    return { decision: "01" };
  }

  if (players[0].move === null) {
    return { decision: "0" };
  }

  return { decision: "1" };
}

export function completeStateLogic(game: Game, isNoBall: boolean): CompleteStateResult {
  let scoreboard  = game.scoreboard!;
  let players = game.players!;
  
  let batterMove; 
  let bowlerMove;
  if (players[0].playerId === scoreboard.batterId) {
    batterMove = Number(players[0].move);
    bowlerMove = Number(players[1].move);
  } else {
    batterMove = Number(players[1].move);
    bowlerMove = Number(players[0].move);
  }

  let newScoreboard = processBall(scoreboard, batterMove, bowlerMove, isNoBall);
  let endOfInningsRes = endOfInnings(newScoreboard);

  if (endOfInningsRes) {
    return { decision: "innings2Done", newScoreboard };
  } else {
    return { decision: null, newScoreboard };
  }
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
