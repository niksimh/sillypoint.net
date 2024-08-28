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
