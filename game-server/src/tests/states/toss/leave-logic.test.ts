import { leaveLogic } from "../../../states/toss/logic";
import { 
  LeaveOneLeftResult,
  LeaveNoOneLeftResult
} from "../../../states/toss/types";
import { Game } from "../../../game-engine/types";

test("Leaving while being p1 with another present player as p2", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1" },
      { playerId: "pId2",  username: "user2" }
    ],
    toss: null,
    scoreboard: null
  };
  
  let rightResult: LeaveOneLeftResult = {
    decision: "oneLeft",
    index: 0
  };

  expect(leaveLogic("pId1", game)).toEqual(rightResult);
})

test("Leaving while being p1 with a temporary disconnected player as p2", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1" },
      { playerId: "pId2",  username: "user2", goneOrTemporaryDisconnect: "temporaryDisconnect" }
    ],
    toss: null,
    scoreboard: null
  };
  
  let rightResult: LeaveOneLeftResult = {
    decision: "oneLeft",
    index: 0
  };

  expect(leaveLogic("pId1", game)).toEqual(rightResult);
})

test("Leaving while being p1 with gone player as p2", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1" },
      { playerId: "pId2",  username: "user2", goneOrTemporaryDisconnect: "gone" }
    ],
    toss: null,
    scoreboard: null
  };
  
  let rightResult: LeaveNoOneLeftResult = {
    decision: "noOneLeft",
    index: 0
  };

  expect(leaveLogic("pId1", game)).toEqual(rightResult);
})

test("Leaving while being p1 with dummy as p2", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1" },
      { playerId: "#",  username: "user2" }
    ],
    toss: null,
    scoreboard: null
  };
  
  let rightResult: LeaveNoOneLeftResult = {
    decision: "noOneLeft",
    index: 0
  };

  expect(leaveLogic("pId1", game)).toEqual(rightResult);
})

test("Leaving while being p2 with another present player as p1", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1" },
      { playerId: "pId2",  username: "user2" }
    ],
    toss: null,
    scoreboard: null
  };
  
  let rightResult: LeaveOneLeftResult = {
    decision: "oneLeft",
    index: 1
  };

  expect(leaveLogic("pId2", game)).toEqual(rightResult);
})

test("Leaving while being p2 with a temporary disconnected player as p1", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", goneOrTemporaryDisconnect: "temporaryDisconnect"},
      { playerId: "pId2",  username: "user2" }
    ],
    toss: null,
    scoreboard: null
  };
  
  let rightResult: LeaveOneLeftResult = {
    decision: "oneLeft",
    index: 1
  };

  expect(leaveLogic("pId2", game)).toEqual(rightResult);
})

test("Leaving while being p1 with gone player as p2", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", goneOrTemporaryDisconnect: "gone" },
      { playerId: "pId2",  username: "user2" }
    ],
    toss: null,
    scoreboard: null
  };
  
  let rightResult: LeaveNoOneLeftResult = {
    decision: "noOneLeft",
    index: 1
  };

  expect(leaveLogic("pId2", game)).toEqual(rightResult);
})
