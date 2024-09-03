export interface OutputContainer {
  subType: string
  data: any
}

export interface GameOutput {
  type: "seqNum"| "gameState" | "leave"
  outputContainer: OutputContainer
}

export interface InputContainer {
  type: string
  input: string
}

export interface GameInput {
  seqNum: number
  inputContainer: InputContainer
}
