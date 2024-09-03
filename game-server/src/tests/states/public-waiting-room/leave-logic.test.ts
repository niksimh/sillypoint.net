import { leaveLogic } from "../../../states/public-waiting-room/logic";
import type {
  LeaveResult,
  WaitingNode, 
} from "../../../states/public-waiting-room/types"

test("Leave public waiting room", ( ) => {
  let waitingQueue: WaitingNode[] = [
    { playerId: "pId1", timeJoined: 0 },
    { playerId: "pId2", timeJoined: 1 },
    { playerId: "pId3", timeJoined: 2 },
  ];

  let rightResult: LeaveResult = {
    decision: "processedLeave",
    index: 1
  };

  expect(leaveLogic("pId2", waitingQueue)).toEqual(rightResult);
}) 
