export interface PlayerContainer {
  playerId: string
  username: string
  move: string | null
  goneOrTemporaryDisconnect: "gone" | "temporaryDisconnect" | null
}

export interface TossContainer {
  evenId: string
  winnerId: string | null
  winnerSelection: "bat" | "bowl" | null
}

export interface ScoreboardContainer {
  runs: number
  balls: number
  wickets: number
  last6: [string,string,string,string,string,string]
  target: number | null
}

export interface Game {
  players: PlayerContainer[]
  toss: TossContainer | null
  scoreboard: ScoreboardContainer | null
  timeout: NodeJS.Timeout | null
}

export type MAX_BALLS = 30;
export type WICKETS = 3;
