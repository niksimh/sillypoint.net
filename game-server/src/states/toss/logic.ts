import { CompleteStateResult, ComputerMoveResult, LeaveResult, PlayerMoveResult } from "./types";
import { Game } from "../../game-engine/types";

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

  return { decision: "partial", index: 1 }
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

export function completeStateLogic(game: Game): CompleteStateResult {
  let players = game.players;
  let tossContainer = game.toss!;

  let p1Move = Number(players[0].move);
  let p2Move = Number(players[1].move);

  let evenResult = (p1Move + p2Move) % 2 === 0;

  if(evenResult) {
    if (tossContainer.evenId === players[0].playerId) {
      return { decision: "0" }
    }
    return { decision: "1" }
  } else {
    if (tossContainer.evenId === players[0].playerId) {
      return { decision: "1" }
    }
    return { decision: "0" }
  }
}
