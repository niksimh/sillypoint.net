import { joinLogic } from "@/states/private-waiting-room/logic";
import {
  JoinPresentResult, 
  JoinBadInputResult,
  JoinBadRoomResult,
  JoinFullResult,
  JoinSuccessfulResult,
  WaitingRoom 
} from "@/states/private-waiting-room/types";

test("Joining private waiting room when already present", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();

  waitingRooms.set(1, { creatorId: "pId1", joinerId: "pId2" });

  playerToWaitingRoom.set("pId1", 1);
  playerToWaitingRoom.set("pId2", 1);

  let rightResult: JoinPresentResult = {
    decision: "present"
  };

  expect(joinLogic(waitingRooms, playerToWaitingRoom, "pId1", "1")).toEqual(rightResult);
})

test("Joining private waiting room with non-numerical input", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();

  waitingRooms.set(1, { creatorId: "pId1", joinerId: null });

  playerToWaitingRoom.set("pId1", 1);

  let rightResult: JoinBadInputResult = {
    decision: "badInput"
  };

  expect(joinLogic(waitingRooms, playerToWaitingRoom, "pId2", "one")).toEqual(rightResult);
})

test("Joining private waiting room with a bad room ID", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();

  waitingRooms.set(1, { creatorId: "pId1", joinerId: null });

  playerToWaitingRoom.set("pId1", 1);

  let rightResult: JoinBadRoomResult = {
    decision: "badRoom"
  };

  expect(joinLogic(waitingRooms, playerToWaitingRoom, "pId2", "2")).toEqual(rightResult);
})

test("Joining private waiting room when the room is already full", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();

  waitingRooms.set(1, { creatorId: "pId1", joinerId: "pId2" });

  playerToWaitingRoom.set("pId1", 1);
  playerToWaitingRoom.set("pId2", 1);

  let rightResult: JoinFullResult = {
    decision: "fullRoom"
  };

  expect(joinLogic(waitingRooms, playerToWaitingRoom, "pId3", "1")).toEqual(rightResult);
})

test("Joining private waiting room successfully", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();

  waitingRooms.set(1, { creatorId: "pId1", joinerId: null });

  playerToWaitingRoom.set("pId1", 1);
  
  let rightResult: JoinSuccessfulResult = {
    decision: "succesful"
  };

  expect(joinLogic(waitingRooms, playerToWaitingRoom, "pId2", "1")).toEqual(rightResult);
})
