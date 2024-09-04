import { Game } from "../game-engine/types"
import type { Player } from "../player-db/types"
import { GameInput, GameOutput } from "../types"

export interface ConnectionAddResult {
  decision: "add"
  playerId: string
  username: string
}

export interface ConnectionBadConnectionRequestResult {
  decision: "badConnectionRequest"
}

export type ConnectionResult = ConnectionAddResult | ConnectionBadConnectionRequestResult;

export interface MessageHandleResult {
  decision: "handle"
  parsedMessage: GameInput
}

export interface MessageLeaveResult {
  decision: "leave"
}

export interface MessageIgnoreResult {
  decision: "ignore"
}

export type MessageResult = MessageHandleResult | MessageLeaveResult | MessageIgnoreResult;

