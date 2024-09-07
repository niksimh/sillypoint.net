import { Game, ScoreboardContainer } from "../../game-engine/types";
import { TransitionIntoResult } from "./types";

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
