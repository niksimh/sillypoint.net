import { processLogic } from "@/states/public-waiting-room/logic";
import { ProcessResult, WaitingNode } from "@/states/public-waiting-room/types";

test("2 players in waiting queue", () => {
  let waitingQueue: WaitingNode[] = [
    { playerId: "pId1", timeJoined: 0 },
    { playerId: "pId2", timeJoined: 1000 }
  ];

  let rightResult: ProcessResult = {
    decision: 2
  }

  expect(processLogic(waitingQueue, 10000)).toEqual(rightResult);
})

test("More than 2 players in waiting queue", () => {
  let waitingQueue: WaitingNode[] = [
    { playerId: "pId1", timeJoined: 0 },
    { playerId: "pId2", timeJoined: 1000 },
    { playerId: "pId3", timeJoined: 2000 },
  ];

  let rightResult: ProcessResult = {
    decision: 2
  }

  expect(processLogic(waitingQueue, 10000)).toEqual(rightResult);
})

test("1 player in waiting queue who has been waiting for less than 10 seconds", () => {
  let waitingQueue: WaitingNode[] = [
    { playerId: "pId1", timeJoined: 5000 },
  ];

  let rightResult: ProcessResult = {
    decision: 0
  }

  expect(processLogic(waitingQueue, 10000)).toEqual(rightResult);
})

test("1 player in waiting queue who has been waiting for 10 seconds", () => {
  let waitingQueue: WaitingNode[] = [
    { playerId: "pId1", timeJoined: 0 }
  ];

  let rightResult: ProcessResult = {
    decision: 1
  }

  expect(processLogic(waitingQueue, 10000)).toEqual(rightResult);
})

test("1 player in waiting queue who has been waiting for more than 10 seconds", () => {
  let waitingQueue: WaitingNode[] = [
    { playerId: "pId1", timeJoined: 0 }
  ];

  let rightResult: ProcessResult = {
    decision: 1
  }

  expect(processLogic(waitingQueue, 11000)).toEqual(rightResult);
})

test("0 players in waiting queue", () => {
  let waitingQueue: WaitingNode[] = [];

  let rightResult: ProcessResult = {
    decision: 0
  }

  expect(processLogic(waitingQueue, 11000)).toEqual(rightResult);
})
