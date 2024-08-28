import { LeaveResult, WaitingNode } from "./types";

export function leaveLogic(playerId: string, waitingQueue: WaitingNode[]): LeaveResult {
  for(let i = 0; i < waitingQueue.length; i += 1){
    if (waitingQueue[i].playerId === playerId) {
      return { decision: "processLeave", index: i };
    }
  }
  return { decision: "ignore" };
}
