import { LeaveResult, WaitingNode } from "./types";

export function leaveLogic(
  waitingRooms: Map<number, WaitingNode>, 
  playerToWaitingRoom: Map<string, number>, 
  playerId: string): LeaveResult {

  if (!playerToWaitingRoom.has(playerId)) {
    return { decision: "leaveNotPresent" }
  }

  let currWaitingNode = waitingRooms.get(playerToWaitingRoom.get(playerId)!)!;

  if(currWaitingNode.creatorId === playerId) {
    if (currWaitingNode.joinerId === undefined) {
      return { decision: "leaveCreatorNoJoiner" }
    } 
    return { decision: "leaveCreatorJoiner" };
  } 

  return { decision: "leaveJoiner" }; 
}
