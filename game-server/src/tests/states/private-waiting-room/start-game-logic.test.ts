import { startGameLogic } from "@/states/private-waiting-room/logic";
import {
  StartGameNotPresentResult,
  StartGameNotCreatorResult,
  StartGameNoJoinerResult,
  StartGameSuccessfulResult,
  WaitingRoom 
} from "@/states/private-waiting-room/types";

test("Start game from private waiting room when not present", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();

  let rightResult: StartGameNotPresentResult = {
    decision: "notPresent"
  };

  expect(startGameLogic(waitingRooms, playerToWaitingRoom, "pId1")).toEqual(rightResult);
})

test("Start game from private waiting room when not the creator", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();

  waitingRooms.set(1, { creatorId: "pId1", joinerId: "pId2" });

  playerToWaitingRoom.set("pId1", 1);
  playerToWaitingRoom.set("pId2", 1);

  let rightResult: StartGameNotCreatorResult = {
    decision: "notCreator"
  };

  expect(startGameLogic(waitingRooms, playerToWaitingRoom, "pId2")).toEqual(rightResult);
})

test("Start game from private waiting room when there is no joiner", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();

  waitingRooms.set(1, { creatorId: "pId1", joinerId: null });

  playerToWaitingRoom.set("pId1", 1);
  
  let rightResult: StartGameNoJoinerResult = {
    decision: "noJoiner"
  };

  expect(startGameLogic(waitingRooms, playerToWaitingRoom, "pId1")).toEqual(rightResult);
})

test("Start game from private waiting room successfully", () => {
  let waitingRooms = new Map<number, WaitingRoom>();
  let playerToWaitingRoom = new Map<string, number>();

  waitingRooms.set(1, { creatorId: "pId1", joinerId: "pId2" });

  playerToWaitingRoom.set("pId1", 1);
  playerToWaitingRoom.set("pId2", 1);

  let rightResult: StartGameSuccessfulResult = {
    decision: "successful"
  };

  expect(startGameLogic(waitingRooms, playerToWaitingRoom, "pId1")).toEqual(rightResult);
})
