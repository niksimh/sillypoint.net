import { GameStateOutput } from "../types";

export interface TossOutput extends GameStateOutput{
  type: "gameState"
  state: "toss"
  data: {
    p1: { playerId: string, username: string } 
    p2: { playerId: string, username: string } 
    evenId: string
    deadline: number
  }
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
