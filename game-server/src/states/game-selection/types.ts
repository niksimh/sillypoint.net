import { GameStateOutput } from "../types";

export interface GameSelectionOutput extends GameStateOutput {
  type: "gameState"
  state: "gameSelection"
}
