import { Game } from "@/game-engine/types";

import { temporaryLeaveLogic } from "@/states/innings-2/logic";
import { TemporaryLeaveResult } from "@/states/innings-2/types";

test("Temporarily leaving as index 0", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: "temporaryDisconnect"},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
  };
  
  let rightResult: TemporaryLeaveResult = {
    index: 0
  };

  expect(temporaryLeaveLogic("pId1", game)).toEqual(rightResult);
})

test("Temporarily leaving as index 1", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: "temporaryDisconnect"}
    ],
    toss: null,
    scoreboard: null,
    timeout: null
  };
  
  let rightResult: TemporaryLeaveResult = {
    index: 1
  };

  expect(temporaryLeaveLogic("pId2", game)).toEqual(rightResult);
})
