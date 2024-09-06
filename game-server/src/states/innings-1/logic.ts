import { Game } from "../../game-engine/types";
import { TransitionIntoResult, PlayerMoveResult } from "./types";

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

export function playerMoveLogic(playerId: string, game: Game, move: string): PlayerMoveResult {
  let numberMove = Number(move);
  if (!Number.isInteger(numberMove) || numberMove < 1 || numberMove > 6) {
    return { decision: "badMove" };
  }

  let players = game.players;

  if (players[0].playerId === playerId) {
    if (players[0].move !== null) {
      return { decision: "badMove" };
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
    return { decision: "badMove" };
  }
  if(players[0].move !== null) {
    return { decision: "complete", index: 1 };
  }
  if (players[0].goneOrTemporaryDisconnect) {
    return { decision: "fulfillOther", index: 1, otherPlayerIndex: 0 };
  }

  return { decision: "partial", index: 1 };
}
