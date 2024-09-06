import { ScoreboardContainer } from "../../game-engine/types";

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
  PlayerMoveCompleteResult;

export interface ComputerMove0Result {
  decision: "0"
}

export interface ComputerMove1Result {
  decision: "1"
}

export interface ComputerMove01Result {
  decision: "01"
}

export type ComputerMoveResult = 
  ComputerMove0Result |
  ComputerMove1Result |
  ComputerMove01Result;

export interface CompleteStateNullResult {
  decision: null
  newScoreboard: ScoreboardContainer
}

export interface CompleteStateInnings1DoneResult {
  decision: "innings1Done"
  newScoreboard: ScoreboardContainer
}

export type CompleteStateResult = 
  CompleteStateNullResult |
  CompleteStateInnings1DoneResult;
