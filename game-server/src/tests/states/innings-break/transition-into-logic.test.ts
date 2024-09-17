import { Game } from "@/game-engine/types";

import { transitionIntoLogic } from "@/states/innings-break/logic";
import { TransitionIntoResult } from "@/states/innings-break/types";

test("Set up innings 2 when p1 was the batter in innings 1", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: {
      batterId: "pId1",
      runs: 10,
      balls: 10, 
      wickets: 1,
      last6: ["","","","","",""],
      target: null
    },
    timeout: null
  };

  let rightResult: TransitionIntoResult = {
    nextScoreboard: {
      batterId: "pId2",
      runs: 0,
      balls: 0, 
      wickets: 0,
      last6: ["","","","","",""],
      target: 11
    }
  };

  expect(transitionIntoLogic(game)).toEqual(rightResult);
})

test("Set up innings 2 when p2 was the batter in innings 1", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: {
      batterId: "pId2",
      runs: 10,
      balls: 10, 
      wickets: 1,
      last6: ["","","","","",""],
      target: null
    },
    timeout: null
  };

  let rightResult: TransitionIntoResult = {
    nextScoreboard: {
      batterId: "pId1",
      runs: 0,
      balls: 0, 
      wickets: 0,
      last6: ["","","","","",""],
      target: 11
    }
  };

  expect(transitionIntoLogic(game)).toEqual(rightResult);
})
