import { Game } from "../../../game-engine/types";
import { completeStateLogic } from "../../../states/innings-2/logic";
import { 
  CompleteStateNullResult,
  CompleteStateInnings1DoneResult
 } from "../../../states/innings-2/types";

test("Complete state when it is not end-of-innings with p1 as batter", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "5", goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: {
      batterId: "pId1",
      runs: 5, 
      balls: 7,
      wickets: 1, 
      last6: ["1", "2", "3", "4", "5", "6"],
      target: 17
    },
    timeout: null
  };

  let rightResult: CompleteStateNullResult = {
    decision: null,
    newScoreboard: {
      batterId: "pId1",
      runs: 10, 
      balls: 8,
      wickets: 1, 
      last6: ["2","3","4","5","6","5"],
      target: 17
    }
  };

  expect(completeStateLogic(game, false)).toEqual(rightResult);
})

test("Complete state when it is not end-of-innings with p2 as batter", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "5", goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: {
      batterId: "pId2",
      runs: 5, 
      balls: 7,
      wickets: 1, 
      last6: ["1", "2", "3", "4", "5", "6"],
      target: 17
    },
    timeout: null
  };

  let rightResult: CompleteStateNullResult = {
    decision: null,
    newScoreboard: {
      batterId: "pId2",
      runs: 8, 
      balls: 8,
      wickets: 1, 
      last6: ["2","3","4","5","6","3"],
      target: 17
    }
  };

  expect(completeStateLogic(game, false)).toEqual(rightResult);
})

test("Complete state when it is end-of-innings with p1 as batter", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "5", goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: {
      batterId: "pId1",
      runs: 16, 
      balls: 7,
      wickets: 1, 
      last6: ["1", "2", "3", "4", "5", "6"],
      target: 17
    },
    timeout: null
  };

  let rightResult: CompleteStateInnings1DoneResult = {
    decision: "innings2Done",
    newScoreboard: {
      batterId: "pId1",
      runs: 21, 
      balls: 8,
      wickets: 1, 
      last6: ["2","3","4","5","6","5"],
      target: 17
    }
  };

  expect(completeStateLogic(game, false)).toEqual(rightResult);
})

test("Complete state when it is end-of-innings with p2 as batter", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "5", goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: {
      batterId: "pId2",
      runs: 5, 
      balls: 29,
      wickets: 1, 
      last6: ["1", "2", "3", "4", "5", "6"],
      target: 17
    },
    timeout: null
  };

  let rightResult: CompleteStateInnings1DoneResult = {
    decision: "innings2Done",
    newScoreboard: {
      batterId: "pId2",
      runs: 8, 
      balls: 30,
      wickets: 1, 
      last6: ["2","3","4","5","6","3"],
      target: 17
    }
  };

  expect(completeStateLogic(game, false)).toEqual(rightResult);
})
