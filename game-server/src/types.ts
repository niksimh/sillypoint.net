export interface PlayerIdTokenPayload {
  playerId: string
  username: string
}

export interface OutputContainer {
  subType: string
  data: any
}

export interface GameOutput {
  type: string  
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
