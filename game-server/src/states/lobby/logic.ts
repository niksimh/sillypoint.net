import { LeaveResult, RejoinResult, TemporaryLeaveResult } from "./types";
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
