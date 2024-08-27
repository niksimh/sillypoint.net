export interface inputHandlerIgnoreResult {
  decision: "ignore"
}

export interface inputHandlerGameSelectionResult {
  decision: "gameSelection",
  input: number
}

export type inputHandlerResult = 
  inputHandlerIgnoreResult |
  inputHandlerGameSelectionResult