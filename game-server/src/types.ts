export interface PlayerIdTokenPayload {
  playerId: string
  username: string
}

export interface GameOutput {
  type: string
}

export interface GameInput {
  seqNum: number
  type: string
  input: string
}

export interface InputContainer {
  type: string
  input: string
}
