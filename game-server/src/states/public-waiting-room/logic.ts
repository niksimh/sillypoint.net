import { LeaveResult, ProcessResult, WaitingNode } from "./types";

export function leaveLogic(playerId: string, waitingQueue: WaitingNode[]): LeaveResult {
  for(let i = 0; i < waitingQueue.length; i += 1){
    if (waitingQueue[i].playerId === playerId) {
      return { decision: "processedLeave", index: i };
    }
  }
  return { decision: "processedLeave", index: 0 } //To appease TS;
}

export function processLogic(waitingQueue: WaitingNode[], currentTime: number): ProcessResult {
  if(waitingQueue.length >= 2) {
    return { decision: 2 };
  }

  if(waitingQueue.length === 1 && currentTime - waitingQueue[0].timeJoined >= 10000) {
    return { decision: 1 };
  }

  return { decision: 0 };
}
