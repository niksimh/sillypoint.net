import type { Player } from "../player-db/player-db"

export interface connectionAddResult {
  decision: "add" 
  playerId: string
  player: Player
}

export interface connectionTerminateResult {
  decision: "terminate" 
  playerId: string
  player: Player
}

export type connectionResult = connectionAddResult | connectionTerminateResult;
