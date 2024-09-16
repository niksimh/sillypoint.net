export interface OutputContainer {
  subType: string
  data: any
}

export interface LeaveOutput {
  type: "leave"
  outputContainer: {
    subType: string,
    data: any
  }
}

export interface SeqNumOutput {
  type: "seqNum"
  outputContainer: {
    subType: ""
    data: {
      seqNum: number
    }
  }
}

export interface GameStateOutput {
  type: "gameState"
  outputContainer: {
    subType: string
    data: any
  }
}

export type GameOutput = 
  LeaveOutput | 
  SeqNumOutput | 
  GameStateOutput

export interface InputContainer {
  type: string
  input: string
}

export interface GameInput {
  seqNum: number
  inputContainer: InputContainer
}
