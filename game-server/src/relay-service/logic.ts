import type { messageResult } from "./types";

import { Player } from "../player-db/types";

export function messageLogic(currPlayer: Player | undefined, message: string): messageResult {
  if (currPlayer === undefined) {
    return { decision: "ignore" };
  }
  if (currPlayer.status === "connecting" || currPlayer.status === "gameOver") {
    return { decision: "ignore" };
  }
  return {
    decision: "handle",
    state: currPlayer.status,
    message: message
  }
}
