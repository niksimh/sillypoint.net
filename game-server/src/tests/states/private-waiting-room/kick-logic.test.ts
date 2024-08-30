import { kickLogic } from "../../../states/private-waiting-room/logic";
import {
  KickNotPresentResult,
  KickNotCreatorResult,
  KickEmptyResult,
  KickSuccesfulResult,
  WaitingNode 
} from "../../../states/private-waiting-room/types";

test("Kick from private waiting room when not present", () => {
  let waitingRooms = new Map<number, WaitingNode>();
  let playerToWaitingRoom = new Map<string, number>();

  let rightResult: KickNotPresentResult = {
    decision: "notPresent"
  };

  expect(kickLogic(waitingRooms, playerToWaitingRoom, "pId1")).toEqual(rightResult);
})

test("Kick from private waiting room when not the creator", () => {
  let waitingRooms = new Map<number, WaitingNode>();
  let playerToWaitingRoom = new Map<string, number>();

  waitingRooms.set(1, { creatorId: "pId1", joinerId: "pId2" });

  playerToWaitingRoom.set("pId1", 1);
  playerToWaitingRoom.set("pId2", 1);

  let rightResult: KickNotCreatorResult = {
    decision: "notCreator"
  };

  expect(kickLogic(waitingRooms, playerToWaitingRoom, "pId2")).toEqual(rightResult);
})

test("Kick from private waiting room when the room is empty", () => {
  let waitingRooms = new Map<number, WaitingNode>();
  let playerToWaitingRoom = new Map<string, number>();

  waitingRooms.set(1, { creatorId: "pId1" });

  playerToWaitingRoom.set("pId1", 1);
  
  let rightResult: KickEmptyResult = {
    decision: "empty"
  };

  expect(kickLogic(waitingRooms, playerToWaitingRoom, "pId1")).toEqual(rightResult);
})

test("Kick from private waiting room successfully", () => {
  let waitingRooms = new Map<number, WaitingNode>();
  let playerToWaitingRoom = new Map<string, number>();

  waitingRooms.set(1, { creatorId: "pId1", joinerId: "pId2" });

  playerToWaitingRoom.set("pId1", 1);
  playerToWaitingRoom.set("pId2", 1);

  let rightResult: KickSuccesfulResult = {
    decision: "successful"
  };

  expect(kickLogic(waitingRooms, playerToWaitingRoom, "pId1")).toEqual(rightResult);
})
