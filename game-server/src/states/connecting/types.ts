export interface ConnectionAddResult {
  decision: "add" 
  playerId: string
  username: string
}

export interface ConnectionTerminateResult {
  decision: "terminate" 
}

export type ConnectionResult = ConnectionAddResult | ConnectionTerminateResult;