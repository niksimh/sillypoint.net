import { GameStateOutput } from "@/types"

export interface WaitingNode {
  playerId: string
  timeJoined: number
}

export interface LeaveResult {
  decision: "processedLeave"
  index: number
}

export interface ProcessResult {
  decision: 0 | 1 | 2 
}

export interface PublicWaitingRoomOutput extends GameStateOutput {
  type: "gameState",
  outputContainer: {
    subType: "publicWaitingRoom"
    data: {}
  }
}
