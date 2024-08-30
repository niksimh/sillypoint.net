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

export interface JoinPresentResult {
  decision: "present"
}

export interface JoinBadInputResult {
  decision: "badInput"
}

export interface JoinBadRoomResult {
  decision: "badRoom"
} 

export interface JoinFullResult {
  decision: "fullRoom"
} 

export interface JoinSuccessfulResult {
  decision: "succesful"
}

export type JoinResult = 
  JoinPresentResult |
  JoinBadInputResult |
  JoinBadRoomResult |
  JoinFullResult |
  JoinSuccessfulResult;