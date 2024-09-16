export interface PlayerIdTokenPayload {
  playerId: string
  username: string
}

export interface CheckInJSON { 
  direction: "/register" | "/game"
}

export interface RegisterErrorJSON {
  error: true
  data: "notAlphaNumeric" | "hasBadWord" | "tooLong" | "undefinedUsername"
}

export interface RegisterSuccessJSON {
  error: false
  data: string
}

export type RegisterJSON = RegisterErrorJSON | RegisterSuccessJSON;
