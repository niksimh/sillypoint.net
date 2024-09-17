import { rejoinLogic } from "@/states/private-waiting-room/logic";
import {
  RejoinResult,
  WaitingRoom 
} from "@/states/private-waiting-room/types";

test("Rejoin as a creator with a joiner", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();
  
  waitingRooms.set(1, { creatorId: "pId1", joinerId: "pId2" });
  playerToWaitingRoom.set("pId1", 1);
  playerToWaitingRoom.set("pId2", 1);

  let rightResult: RejoinResult = {
    decision: "creatorJoiner"
  };

  expect(rejoinLogic(waitingRooms, playerToWaitingRoom, "pId1")).toEqual(rightResult);
})

test("Rejoin as a creator without a joiner", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();
  
  waitingRooms.set(1, { creatorId: "pId1", joinerId: null });
  playerToWaitingRoom.set("pId1", 1);

  let rightResult: RejoinResult = {
    decision: "creatorNoJoiner"
  };

  expect(rejoinLogic(waitingRooms, playerToWaitingRoom, "pId1")).toEqual(rightResult);
})

test("Rejoin as a joiner before having joined", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();
  
  let rightResult: RejoinResult = {
    decision: "joinerNotJoined"
  };

  expect(rejoinLogic(waitingRooms, playerToWaitingRoom, "pId2")).toEqual(rightResult);
})

test("Rejoin as a joiner having joined", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();
  
  waitingRooms.set(1, { creatorId: "pId1", joinerId: "pId2" });
  playerToWaitingRoom.set("pId1", 1);
  playerToWaitingRoom.set("pId2", 1);

  let rightResult: RejoinResult = {
    decision: "joinerJoined"
  };

  expect(rejoinLogic(waitingRooms, playerToWaitingRoom, "pId2")).toEqual(rightResult);
})