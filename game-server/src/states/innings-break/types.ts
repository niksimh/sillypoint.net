import { ScoreboardContainer } from "../../game-engine/types"

export interface TransitionIntoResult {
  nextScoreboard: ScoreboardContainer
}

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
