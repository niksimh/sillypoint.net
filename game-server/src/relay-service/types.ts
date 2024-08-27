import type { Player } from "../player-db/types"

export interface ConnectionAddResult {
  decision: "add"
  playerId: "string"
  username: "username"
}

export interface ConnectionTerminateResult {
  decision: "terminate"
}

export type ConnectionResult = ConnectionAddResult | ConnectionTerminateResult;

export interface messageHandleResult {
  decision: "handle"
  state: string
  message: string
}

export interface messageIgnoreResult {
  decision: "ignore"
}

export type messageResult = messageHandleResult | messageIgnoreResult;
