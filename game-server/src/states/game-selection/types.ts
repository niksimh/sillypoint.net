import { GameStateOutput } from "@/types";

export interface GameSelectionOutput extends GameStateOutput {
  type: "gameState"
  outputContainer: {
    subType: "gameSelection"
    data: {}
  }
}
