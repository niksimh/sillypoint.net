import type { Player } from "../player-db/player-db"

export interface connectionResult {
  decision: "add" | "terminate"
  playerId?: string
  player?: Player
}
