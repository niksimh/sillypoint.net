import { completeStateLogic } from "../../../states/toss-winner-selection/logic";
import { Game } from "../../../game-engine/types";
import { 
  CompleteState0Result,
  CompleteState1Result
} from "../../../states/toss-winner-selection/types";

test("Complete state when p1 is the toss winner", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "bat", goneOrTemporaryDisconnect: null},
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

  let rightResult: CompleteState0Result = {
    decision: "0"
  };

  expect(completeStateLogic(game)).toEqual(rightResult);
})

test("Complete state when p2 is the toss winner", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "bat", goneOrTemporaryDisconnect: null}
    ],
    toss: {
      evenId: "pId1",
      winnerId: "pId2",
      winnerSelection: null
    },
    scoreboard: null,
    timeout: null
  };

  let rightResult: CompleteState1Result = {
    decision: "1"
  };

  expect(completeStateLogic(game)).toEqual(rightResult);
})
