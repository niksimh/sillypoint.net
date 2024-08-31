export interface PlayerContainer {
  playerId: string
  move: string
}

export interface Toss {
  evenId: string
  winnerId: string
}

export interface Scoreboard {
  runs: number
  balls: number
  wickets: number
  last6: [string,string,string,string,string,string]
  target?: number
}

export interface Game {
  players: PlayerContainer[]
  toss: Toss | undefined
  Scoreboard: Scoreboard | undefined 
}

export type MAX_BALLS = 30;
export type WICKETS = 3;
