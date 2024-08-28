import { leaveLogic } from "../../../states/public-waiting-room/logic";
import type {
  WaitingNode,
  LeaveProcessLeaveResult,
  LeaveIgnoreResult
} from "../../../states/public-waiting-room/types"

test("Try leaving public waiting room when not present", () => {
  let waitingQueue: WaitingNode[] = [
    { playerId: "pId1", timeJoined: 0 }
  ];

  let rightResult: LeaveIgnoreResult = {
    decision: "ignore"
  }

  expect(leaveLogic("pId2", waitingQueue)).toEqual(rightResult);
})

test("Leave public waiting room when present", ( ) => {
  let waitingQueue: WaitingNode[] = [
    { playerId: "pId1", timeJoined: 0 },
    { playerId: "pId2", timeJoined: 1 },
    { playerId: "pId3", timeJoined: 2 },
  ];

  let rightResult: LeaveProcessLeaveResult = {
    decision: "processLeave",
    index: 1
  }

  expect(leaveLogic("pId2", waitingQueue)).toEqual(rightResult);
}) 
