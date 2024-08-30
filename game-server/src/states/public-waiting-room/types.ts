export interface WaitingNode {
  playerId: string
  timeJoined: number
}

export interface LeaveProcessLeaveResult {
  decision: "processLeave"
  index: number
}

export interface LeaveIgnoreResult {
decision: "ignore"
}

export type LeaveResult = LeaveProcessLeaveResult | LeaveIgnoreResult;

export interface ProcessResult {
  decision: 0 | 1 | 2 
}