import { GameStateOutput } from "../types"

export interface WaitingRoom {
  creatorId: string
  joinerId: string | null
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


export interface KickNotPresentResult {
  decision: "notPresent"
}

export interface KickNotCreatorResult {
  decision: "notCreator"
}

export interface KickEmptyResult {
  decision: "empty"
}

export interface KickSuccesfulResult {
  decision: "successful"
}

export type KickResult = 
  KickNotPresentResult |
  KickNotCreatorResult |
  KickEmptyResult |
  KickSuccesfulResult;

export interface StartGameNotPresentResult {
  decision: "notPresent"
}

export interface StartGameNotCreatorResult {
  decision: "notCreator"
}

export interface StartGameNoJoinerResult {
  decision: "noJoiner"
}

export interface StartGameSuccessfulResult {
  decision: "successful"
}

export type StartGameResult = 
  StartGameNotPresentResult |
  StartGameNotCreatorResult |
  StartGameNoJoinerResult |
  StartGameSuccessfulResult;
  
export interface RejoinResult {
  decision: 
    "creatorNoJoiner" |
    "creatorJoiner" |
    "joinerNotJoined" |
    "joinerJoined"
}

export interface PrivateWaitingRoomCreatorNoJoinerOutput extends GameStateOutput{
  type: "gameState"
  outputContainer: {
    subType: "privateWaitingRoomCreator"
    data: {
      roomId: number
    }
  }

}

export interface PrivateWaitingRoomCreatorJoinerOutput extends GameStateOutput {
  type: "gameState"
  outputContainer: {
    subType: "privateWaitingRoomCreator"
    data: {
      roomId: number
      otherPlayerId: string
      otherPlayerUsername: string
    }
  }
}

export interface PrivateWaitingRoomJoinerPreJoinOutput extends GameStateOutput {
  type: "gameState"
  outputContainer: {
    subType: "privateWaitingRoomJoiner"
    data: {
      status: string
    }
  }
}

export interface PrivateWaitingRoomJoinerJoinedOutput extends GameStateOutput{
  type: "gameState"
  outputContainer: {
    subType: "privateWaitingRoomJoiner"
    data: {
      roomId: number
      otherPlayerId: string
      otherPlayerUsername: string
    }
  }
}
