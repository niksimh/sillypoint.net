import type { Player } from "../player-db/player-db"

export interface connectionAddResult {
  decision: "add" 
  playerId: string
  player: Player
}

export interface connectionTerminateResult {
  decision: "terminate" 
}

export type connectionResult = connectionAddResult | connectionTerminateResult;

export interface messageHandleResult {
  decision: "handle"
  state: string
  message: string
}

export interface messageIgnoreResult {
  decision: "ignore"
}

export type messageResult = messageHandleResult | messageIgnoreResult;