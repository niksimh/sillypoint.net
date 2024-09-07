export interface PlayerMoveBadInputResult {
  decision: "badInput"
}

export interface PlayerMovePartialResult {
  decision: "partial"
  index: number
}

export interface PlayerMoveFulfillOtherResult {
  decision: "fulfillOther"
  index: number
  otherPlayerIndex: number
}

export interface PlayerMoveCompleteResult {
  decision: "complete"
  index: number
}

export type PlayerMoveResult = 
  PlayerMoveBadInputResult |
  PlayerMovePartialResult |
  PlayerMoveFulfillOtherResult |
  PlayerMoveCompleteResult;