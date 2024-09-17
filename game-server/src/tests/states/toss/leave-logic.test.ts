import { Game } from "@/game-engine/types";

import { leaveLogic } from "@/states/toss/logic";
import { 
  LeaveOneLeftResult,
  LeaveNoOneLeftResult
} from "@/states/toss/types";

test("Leaving while being p1 with another present player as p2", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
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
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: "temporaryDisconnect"}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
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
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: "gone" }
    ],
    toss: null,
    scoreboard: null,
    timeout: null
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
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "#",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
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
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
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
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: "temporaryDisconnect"},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
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
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: "gone" },
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
  };
  
  let rightResult: LeaveNoOneLeftResult = {
    decision: "noOneLeft",
    index: 1
  };

  expect(leaveLogic("pId2", game)).toEqual(rightResult);
})
