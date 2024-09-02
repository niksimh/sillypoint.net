import { Game } from "../game-engine/types"
import type { Player } from "../player-db/types"
import { GameInput, GameOutput } from "../types"

export interface ConnectionAddResult {
  decision: "add"
  playerId: string
  username: string
}

export interface ConnectionBadConnectionRequestResult {
  decision: "badConnectionRequest"
}

export type ConnectionResult = ConnectionAddResult | ConnectionBadConnectionRequestResult;

export interface MessageHandleResult {
  decision: "handle"
  parsedMessage: GameInput
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

export interface LeaveBadConnectionRequestOutput extends GameOutput {
  type: "leave"
  outputContainer: {
    subType: "badConnectionRequest"
    data: {}
  }
}
