import { Game } from "@/game-engine/types";

import { computerMoveLogic } from "@/states/innings-2/logic";
import { 
  ComputerMove0Result,
  ComputerMove1Result,
  ComputerMove01Result
 } from "@/states/innings-2/types";

test("Computer needing to make a move for p1", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
  };

  let rightResult: ComputerMove0Result = {
    decision: "0"
  };

  expect(computerMoveLogic(game)).toEqual(rightResult);
})

test("Computer needing to make a move for p2", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "3", goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
  };

  let rightResult: ComputerMove1Result = {
    decision: "1"
  };

  expect(computerMoveLogic(game)).toEqual(rightResult);
})

test("Computer needing to make a move for p1 and p2", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
  };

  let rightResult: ComputerMove01Result = {
    decision: "01"
  };

  expect(computerMoveLogic(game)).toEqual(rightResult);
})
