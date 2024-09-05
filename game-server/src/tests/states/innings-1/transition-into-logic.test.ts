import { Game } from "../../../game-engine/types";
import { transitionIntoLogic } from "../../../states/innings-1/logic";
import { TransitionIntoResult } from "../../../states/innings-1/types";

test("Set up innings 1 when p1 has won toss and has chosen to bat", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: { 
      evenId: "pId1",
      winnerId: "pId1",
      winnerSelection: "bat"
    },
    scoreboard: null,
    timeout: null
  };

  let rightResult: TransitionIntoResult = {
    decision: 0
  };

  expect(transitionIntoLogic(game)).toEqual(rightResult);
})

test("Set up innings 1 when p1 has won toss and has chosen to bowl", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: { 
      evenId: "pId1",
      winnerId: "pId1",
      winnerSelection: "bowl"
    },
    scoreboard: null,
    timeout: null
  };

  let rightResult: TransitionIntoResult = {
    decision: 1
  };

  expect(transitionIntoLogic(game)).toEqual(rightResult);
})

test("Set up innings 1 when p2 has won toss and has chosen to bat", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: { 
      evenId: "pId1",
      winnerId: "pId2",
      winnerSelection: "bat"
    },
    scoreboard: null,
    timeout: null
  };

  let rightResult: TransitionIntoResult = {
    decision: 1
  };

  expect(transitionIntoLogic(game)).toEqual(rightResult);
})

test("Set up innings 1 when p1 has won toss and has chosen to bowl", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: { 
      evenId: "pId1",
      winnerId: "pId2",
      winnerSelection: "bowl"
    },
    scoreboard: null,
    timeout: null
  };

  let rightResult: TransitionIntoResult = {
    decision: 0
  };

  expect(transitionIntoLogic(game)).toEqual(rightResult);
})
