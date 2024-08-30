import type { Player } from "../player-db/types"

export interface ConnectionAddResult {
  decision: "add"
  playerId: string
  username: string
}

export interface ConnectionTerminateResult {
  decision: "terminate"
}

export type ConnectionResult = ConnectionAddResult | ConnectionTerminateResult;

export interface MessageHandleResult {
  decision: "handle"
}

export interface MessageLeaveResult {
  decision: "leave"
}

export type MessageResult = MessageHandleResult | MessageLeaveResult;
