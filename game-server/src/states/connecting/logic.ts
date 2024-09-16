import { Player } from "@/player-db/types";

import { TransitionIntoResult } from "@/states/connecting/types";

export function transitionIntoLogic(player: Player | undefined): TransitionIntoResult {
  if (player === undefined) {
    return { decision: "add" };
  }
  if (player.socket === null) {
    return { decision: "rejoin" };
  }
  return { decision: "close" };
}
