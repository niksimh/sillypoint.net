import { rejoinLogic } from "../../../states/toss-winner-selection/logic";
import { 
  RejoinResult
} from "../../../states/toss-winner-selection/types";
import { Game } from "../../../game-engine/types";

test("Rejoining as index 0", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: "temporaryDisconnect"},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
  };
  
  let rightResult: RejoinResult = {
    index: 0
  };

  expect(rejoinLogic("pId1", game)).toEqual(rightResult);
})

test("Rejoining as index 1", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: "temporaryDisconnect"}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
  };
  
  let rightResult: RejoinResult = {
    index: 1
  };

  expect(rejoinLogic("pId2", game)).toEqual(rightResult);
})
