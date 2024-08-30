export interface PlayerIdTokenPayload {
  playerId: string
  username: string
}

export interface GameOutput {
  type: string
}

export interface GameInput {
  seqNum: number
  inputContainer: InputContainer
}

export interface InputContainer {
  type: string
  input: string
}
