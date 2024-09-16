import { Game } from "@/game-engine/types";

import { rejoinLogic } from "@/states/innings-break/logic";
import { 
  RejoinResult
} from "@/states/innings-break/types";

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
