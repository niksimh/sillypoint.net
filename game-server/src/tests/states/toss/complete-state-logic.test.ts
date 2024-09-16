import { Game } from "@/game-engine/types";

import { completeStateLogic } from "@/states/toss/logic";
import { 
  CompleteStateResult
 } from "@/states/toss/types";

test("p1 wins toss as even player", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "3", goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: null}
    ],
    toss: { 
      evenId: "pId1",
      winnerId: null,
      winnerSelection: null
    },
    scoreboard: null,
    timeout: null
  };

  let rightResult: CompleteStateResult = {
    decision: "0"
  };

  expect(completeStateLogic(game)).toEqual(rightResult);
})

test("p1 wins toss as odd player", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "4", goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: null}
    ],
    toss: { 
      evenId: "pId2",
      winnerId: null,
      winnerSelection: null
    },
    scoreboard: null,
    timeout: null
  };

  let rightResult: CompleteStateResult = {
    decision: "0"
  };

  expect(completeStateLogic(game)).toEqual(rightResult);
})

test("p2 wins toss as even player", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "3", goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: null}
    ],
    toss: { 
      evenId: "pId2",
      winnerId: null,
      winnerSelection: null
    },
    scoreboard: null,
    timeout: null
  };

  let rightResult: CompleteStateResult = {
    decision: "1"
  };

  expect(completeStateLogic(game)).toEqual(rightResult);
})

test("p2 wins toss as odd player", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "4", goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: null}
    ],
    toss: { 
      evenId: "pId1",
      winnerId: null,
      winnerSelection: null
    },
    scoreboard: null,
    timeout: null
  };

  let rightResult: CompleteStateResult = {
    decision: "1"
  };

  expect(completeStateLogic(game)).toEqual(rightResult);
})
