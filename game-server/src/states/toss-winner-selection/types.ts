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
