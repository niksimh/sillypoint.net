import { Game, ScoreboardContainer } from "../../game-engine/types";
import { TransitionIntoResult, LeaveResult, RejoinResult, TemporaryLeaveResult } from "./types";

export function transitionIntoLogic(game: Game): TransitionIntoResult {
  let players = game.players;
  let scoreboard = game.scoreboard!;

  let nextBatterId; 
  let nextBatterIndex: 0 | 1;
  if (players[0].playerId === scoreboard.batterId) {
    nextBatterId = players[1].playerId;
    nextBatterIndex = 1;
  } else {
    nextBatterId = players[0].playerId;
    nextBatterIndex = 0;
  }
  
  let nextScoreboard: ScoreboardContainer = {
    batterId: nextBatterId,
    runs: 0,
    balls: 0,
    wickets: 0,
    last6: ["", "", "", "", "", ""],
    target: scoreboard.runs + 1
  }

  return { 
    nextScoreboard
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

export function rejoinLogic(playerId: string, game: Game): RejoinResult {
  let players = game.players;

  if(players[0].playerId === playerId) {
    return { index: 0 };
  }

  return { index: 1 };
}

export function temporaryLeaveLogic(playerId: string, game: Game): TemporaryLeaveResult {
  let players = game.players;

  if(players[0].playerId === playerId) {
    return { index: 0 };
  }

  return { index: 1 };
}
