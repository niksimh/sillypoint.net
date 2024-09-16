import { Game } from "@/game-engine/types"
import { TransitionIntoResult } from "@/states/game-over/types";

export function transitionIntoLogic(game: Game): TransitionIntoResult {
  let players = game.players;
  let scoreboard = game.scoreboard!;

  let batterIndex: 0 | 1;
  let bowlerIndex: 0 | 1;
  if (players[0].playerId === scoreboard.batterId) {
    batterIndex = 0;
    bowlerIndex = 1;
  } else {
    batterIndex = 1;
    bowlerIndex = 0;
  }


  if(scoreboard.runs >= scoreboard.target!) {
    return {
      batterIndex,
      bowlerIndex,
      winnerId: players[batterIndex].playerId
    }
  } else if (scoreboard.runs < (scoreboard.target! - 1)) {
    return {
      batterIndex,
      bowlerIndex,
      winnerId: players[bowlerIndex].playerId
    }
  } else {
    return {
      batterIndex,
      bowlerIndex,
      winnerId: null
    }
  }
}
