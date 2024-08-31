import { GameStateOutput } from "../types";

export interface LobbyOutput extends GameStateOutput {
  type: "gameState",
  state: "lobby"
  data: {
    p1: { playerId: string, username: string } 
    p2: { playerId: string, username: string } 
  }
}