export interface TransitionIntoResult {
  decision: 0 | 1;
}

export interface PlayerMoveBadMoveResult {
  decision: "badMove"
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
  PlayerMoveBadMoveResult |
  PlayerMovePartialResult |
  PlayerMoveFulfillOtherResult |
  PlayerMoveCompleteResult