import { computerMoveLogic } from "../../../states/toss-winner-selection/logic";
import { Game } from "../../../game-engine/types";
import { 
  ComputerMove0Result,
  ComputerMove1Result
} from "../../../states/toss-winner-selection/types";

test("p1 has not yet made their move as the toss winner", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: {
      evenId: "pId1",
      winnerId: "pId1",
      winnerSelection: null
    },
    scoreboard: null,
    timeout: null
  };

  let rightResult: ComputerMove0Result = {
    decision: "0"
  };

  expect(computerMoveLogic(game)).toEqual(rightResult);
})

test("p2 has not yet made their move as the toss winner", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: {
      evenId: "pId1",
      winnerId: "pId2",
      winnerSelection: null
    },
    scoreboard: null,
    timeout: null
  };

  let rightResult: ComputerMove1Result = {
    decision: "1"
  };

  expect(computerMoveLogic(game)).toEqual(rightResult);
})
