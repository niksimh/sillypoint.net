import { ScoreboardContainer } from "@/game-engine/types"

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
  decision: "innings2Done"
  newScoreboard: ScoreboardContainer
}

export type CompleteStateResult = 
  CompleteStateNullResult |
  CompleteStateInnings1DoneResult;

export interface LeaveOneLeftResult {
  decision: "oneLeft"
  index: 0 | 1
}

export interface LeaveNoOneLeftResult {
  decision: "noOneLeft"
  index: 0 | 1
}

export type LeaveResult = 
  LeaveOneLeftResult |
  LeaveNoOneLeftResult;

export interface RejoinResult {
  index: 0 | 1
}

export interface TemporaryLeaveResult {
  index: 0 | 1
}
