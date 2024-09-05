import { Game } from "../../game-engine/types";
import { TransitionIntoResult } from "./types";

export function transitionIntoLogic(game: Game): TransitionIntoResult {
  let tossWinnerId = game.toss!.winnerId;
  let tossWinnerSelection = game.toss!.winnerSelection;
  let players = game.players;

  if (players[0].playerId === tossWinnerId) {
    if (tossWinnerSelection === "bat") {
      return { decision: 0 }
    }
    return { decision: 1 };
  }

  if (tossWinnerSelection === "bat") {
    return { decision: 1 }
  }
  return { decision: 0 }; 
}
