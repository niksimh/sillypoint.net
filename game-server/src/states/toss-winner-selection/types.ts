import { GameStateOutput } from "../types";

export interface TossWinnerSelectionOutput extends GameStateOutput{
  type: "gameState"
  state: "tossWinnerSelection"
  data: {
    p1: { playerId: string, username: string } 
    p2: { playerId: string, username: string } 
    winnerId: string
    deadline: number
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