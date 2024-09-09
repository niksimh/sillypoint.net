import { GameStateOutput } from "../types";

export interface TossWinnerSelectionOutput extends GameStateOutput{
  type: "gameState"
  outputContainer: {
    subType: "tossWinnerSelection"
    data: {
      p1: { playerId: string, username: string } 
      p2: { playerId: string, username: string } 
      winnerId: string
      deadline: number
    }
  }
}

export interface PlayerMoveBadMoveResult {
  decision: "badMove"
}


export interface PlayerMoveCompleteResult {
  decision: "complete"
  index: number
}

export type PlayerMoveResult = 
  PlayerMoveBadMoveResult |
  PlayerMoveCompleteResult;

export interface ComputerMove0Result {
  decision: "0"
}

export interface ComputerMove1Result {
  decision: "1"
}

export type ComputerMoveResult = 
  ComputerMove0Result |
  ComputerMove1Result;


export interface CompleteState0Result {
  decision: "0"
}

export interface CompleteState1Result {
  decision: "1"
}

export type CompleteStateResult = 
  ComputerMove0Result |
  ComputerMove1Result;

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
