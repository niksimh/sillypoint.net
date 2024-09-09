import { Game } from "../../../game-engine/types";
import { transitionIntoLogic } from "../../../states/game-over/logic";
import { TransitionIntoResult } from "../../../states/game-over/types";


test("Batter has won the game as index 0", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: {
      batterId: "pId1",
      runs: 18, 
      balls: 29,
      wickets: 1, 
      last6: ["1", "2", "3", "4", "5", "6"],
      target: 17
    },
    timeout: null
  };
  
  let rightResult: TransitionIntoResult = {
    batterIndex: 0,
    bowlerIndex: 1,
    winnerId: "pId1"
  }

  expect(transitionIntoLogic(game)).toEqual(rightResult);
})

test("Batter has won the game as index 1", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: {
      batterId: "pId2",
      runs: 18, 
      balls: 29,
      wickets: 1, 
      last6: ["1", "2", "3", "4", "5", "6"],
      target: 17
    },
    timeout: null
  };
  
  let rightResult: TransitionIntoResult = {
    batterIndex: 1,
    bowlerIndex: 0,
    winnerId: "pId2"
  }

  expect(transitionIntoLogic(game)).toEqual(rightResult);
})

test("Bowler has won the game as index 0", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: {
      batterId: "pId2",
      runs: 15, 
      balls: 30,
      wickets: 1, 
      last6: ["1", "2", "3", "4", "5", "6"],
      target: 17
    },
    timeout: null
  };
  
  let rightResult: TransitionIntoResult = {
    batterIndex: 1,
    bowlerIndex: 0,
    winnerId: "pId1"
  }

  expect(transitionIntoLogic(game)).toEqual(rightResult);
})

test("Bowler has won the game as index 1", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: {
      batterId: "pId1",
      runs: 15, 
      balls: 30,
      wickets: 1, 
      last6: ["1", "2", "3", "4", "5", "6"],
      target: 17
    },
    timeout: null
  };
  
  let rightResult: TransitionIntoResult = {
    batterIndex: 0,
    bowlerIndex: 1,
    winnerId: "pId2"
  }

  expect(transitionIntoLogic(game)).toEqual(rightResult);
})

test("No one has won the game", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: {
      batterId: "pId1",
      runs: 16, 
      balls: 30,
      wickets: 1, 
      last6: ["1", "2", "3", "4", "5", "6"],
      target: 17
    },
    timeout: null
  };
  
  let rightResult: TransitionIntoResult = {
    batterIndex: 0,
    bowlerIndex: 1,
    winnerId: null
  }

  expect(transitionIntoLogic(game)).toEqual(rightResult);
})