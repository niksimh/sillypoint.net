export interface WaitingNode {
  creatorId: string
  joinerId?: string
}

export interface LeaveNotPresentResult {
  decision: "leaveNotPresent"
}

export interface LeaveCreatorNoJoinerResult {
  decision: "leaveCreatorNoJoiner"
}

export interface LeaveCreatorJoinerResult {
  decision: "leaveCreatorJoiner"
}

export interface LeaveJoinerResult {
  decision: "leaveJoiner"
}

export type LeaveResult = 
  LeaveNotPresentResult | 
  LeaveCreatorNoJoinerResult | 
  LeaveCreatorJoinerResult | 
  LeaveJoinerResult;