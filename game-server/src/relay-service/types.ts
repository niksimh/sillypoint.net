import type { Player } from "../player-db/types"

export interface messageHandleResult {
  decision: "handle"
  state: string
  message: string
}

export interface messageIgnoreResult {
  decision: "ignore"
}

export type messageResult = messageHandleResult | messageIgnoreResult;
