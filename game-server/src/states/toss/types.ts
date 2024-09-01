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
