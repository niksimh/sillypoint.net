import { GameStateOutput } from "../types";

export interface LobbyOutput extends GameStateOutput {
  type: "gameState",
  state: "lobby"
  data: {
    p1: { playerId: string, username: string } 
    p2: { playerId: string, username: string } 
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