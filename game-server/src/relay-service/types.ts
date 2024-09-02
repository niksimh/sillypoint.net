import type { Player } from "../player-db/types"
import { GameOutput } from "../types"

export interface ConnectionAddResult {
  decision: "add"
  playerId: string
  username: string
}

export interface ConnectionTerminateResult {
  decision: "terminate"
}

export type ConnectionResult = ConnectionAddResult | ConnectionTerminateResult;

export interface MessageHandleResult {
  decision: "handle"
}

export interface MessageLeaveResult {
  decision: "leave"
}

export type MessageResult = MessageHandleResult | MessageLeaveResult;

export interface SeqNumOutput extends GameOutput {
  type: "seqNum"
  outputContainer: {
    subType: ""
    data: {
      seqNum: number
    }
  }
}