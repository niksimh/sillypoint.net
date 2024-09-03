import { leaveLogic } from "../../../states/private-waiting-room/logic";
import {
   LeaveNotPresentResult, 
   LeaveCreatorNoJoinerResult,
   LeaveCreatorJoinerResult,
   LeaveJoinerResult,
   WaitingRoom 
} from "../../../states/private-waiting-room/types";

test("Leaving private waiting room when not present", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();

  let rightResult: LeaveNotPresentResult = {
    decision: "leaveNotPresent"
  }
  expect(leaveLogic(waitingRooms, playerToWaitingRoom, "pId")).toEqual(rightResult);
});

test("Leaving private waiting as the creator when there is no joiner", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();
  waitingRooms.set(1, { creatorId: "pId", joinerId: null });
  playerToWaitingRoom.set("pId", 1);

  let rightResult: LeaveCreatorNoJoinerResult = {
    decision: "leaveCreatorNoJoiner"
  }
  expect(leaveLogic(waitingRooms, playerToWaitingRoom, "pId")).toEqual(rightResult);
});

test("Leaving private waiting as the creator when there is a joiner", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();
  waitingRooms.set(1, { creatorId: "pId1", joinerId: "pId2" });
  playerToWaitingRoom.set("pId1", 1);
  playerToWaitingRoom.set("pId2", 1);

  let rightResult: LeaveCreatorJoinerResult = {
    decision: "leaveCreatorJoiner"
  }
  expect(leaveLogic(waitingRooms, playerToWaitingRoom, "pId1")).toEqual(rightResult);
});

test("Leaving private waiting room as the joiner", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();
  waitingRooms.set(1, { creatorId: "pId1", joinerId: "pId2" });
  playerToWaitingRoom.set("pId1", 1);
  playerToWaitingRoom.set("pId2", 1);

  let rightResult: LeaveJoinerResult = {
    decision: "leaveJoiner"
  }
  expect(leaveLogic(waitingRooms, playerToWaitingRoom, "pId2")).toEqual(rightResult);
});