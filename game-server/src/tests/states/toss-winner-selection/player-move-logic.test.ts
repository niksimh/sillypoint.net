import { Game } from "@/game-engine/types";

import { playerMoveLogic } from "@/states/toss-winner-selection/logic";
import { 
  PlayerMoveBadMoveResult,
  PlayerMoveCompleteResult
} from "@/states/toss-winner-selection/types";

test ("Toss winner making a selection move that is not 'bat' or 'bowl'", () => {
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

  let rightResult: PlayerMoveBadMoveResult = {
    decision: "badMove"
  };

  expect(playerMoveLogic("pId1", game, "badMove")).toEqual(rightResult);
})

test("Non-winner making toss winner selection move", () => {
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

  let rightResult: PlayerMoveBadMoveResult = {
    decision: "badMove"
  };

  expect(playerMoveLogic("pId2", game, "bat")).toEqual(rightResult);
})

test("p1 as toss winner making their selection move", () => {
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

  let rightResult: PlayerMoveCompleteResult = {
    decision: "complete",
    index: 0
  };

  expect(playerMoveLogic("pId1", game, "bat")).toEqual(rightResult);
})

test("p1 as toss winner trying to duplicate their move", () => {
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

  let rightResult: PlayerMoveBadMoveResult = {
    decision: "badMove"
  };

  expect(playerMoveLogic("pId1", game, "bowl")).toEqual(rightResult);
})

test("p2 as toss winner making their selection move", () => {
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

  let rightResult: PlayerMoveCompleteResult = {
    decision: "complete",
    index: 1
  };

  expect(playerMoveLogic("pId2", game, "bat")).toEqual(rightResult);
})

test("p2 as toss winner trying to duplicate their move", () => {
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

  let rightResult: PlayerMoveBadMoveResult = {
    decision: "badMove"
  };

  expect(playerMoveLogic("pId2", game, "bowl")).toEqual(rightResult);
})