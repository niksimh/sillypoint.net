import { Game } from "../../../game-engine/types";
import { playerMoveLogic } from "../../../states/toss/logic";
import { 
  PlayerMoveBadMoveResult,
  PlayerMovePartialResult,
  PlayerMoveFulfillOtherResult,
  PlayerMoveCompleteResult
 } from "../../../states/toss/types";

test("Make bad move that is not an int as p1", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveBadMoveResult = {
    decision: "badMove"
  };

  expect(playerMoveLogic("pId1", game, "badMove")).toEqual(rightResult);
})

test("Make bad move that is an out-of-bound int as p1", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveBadMoveResult = {
    decision: "badMove"
  };

  expect(playerMoveLogic("pId1", game, "7")).toEqual(rightResult);
})

test("Make move as p1 after previously making move", () => {
  //bad move
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "4", goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveBadMoveResult = {
    decision: "badMove"
  };

  expect(playerMoveLogic("pId1", game, "3")).toEqual(rightResult);
})

test("Make move as p1 after p2 has made their move", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveCompleteResult = {
    decision: "complete",
    index: 0
  };

  expect(playerMoveLogic("pId1", game, "3")).toEqual(rightResult);
})

test("Make move as  p1 when p2 is gone/temp disconnect but has made their move prior", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: "gone"}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveCompleteResult = {
    decision: "complete",
    index: 0
  };

  expect(playerMoveLogic("pId1", game, "3")).toEqual(rightResult);
})

test("Make move as p1 before p2 has made their move while they are present", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMovePartialResult = {
    decision: "partial",
    index: 0
  };

  expect(playerMoveLogic("pId1", game, "3")).toEqual(rightResult);
})

test("Make move as p1 when p2 is dummy", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "#",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveFulfillOtherResult = {
    decision: "fulfillOther",
    index: 0,
    otherPlayerIndex: 1
  };

  expect(playerMoveLogic("pId1", game, "3")).toEqual(rightResult);
})

test("Make move as p1 when p2 is gone/temp disconnect but has not made their move prior", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "#",  username: "user2", move: null, goneOrTemporaryDisconnect: "temporaryDisconnect"}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveFulfillOtherResult = {
    decision: "fulfillOther",
    index: 0,
    otherPlayerIndex: 1
  };

  expect(playerMoveLogic("pId1", game, "3")).toEqual(rightResult);
})

////////////////

test("Make bad move as p2", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveBadMoveResult = {
    decision: "badMove"
  };

  expect(playerMoveLogic("pId2", game, "badMove")).toEqual(rightResult);
})

test("Make bad move that is an out-of-bound int as p2", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveBadMoveResult = {
    decision: "badMove"
  };

  expect(playerMoveLogic("pId2", game, "7")).toEqual(rightResult);
})

test("Make move as p2 after previously making move", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: "3", goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveBadMoveResult = {
    decision: "badMove"
  };

  expect(playerMoveLogic("pId2", game, "4")).toEqual(rightResult);
})

test("Make move as p2 after p1 has made their move", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "3", goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveCompleteResult = {
    decision: "complete",
    index: 1
  };

  expect(playerMoveLogic("pId2", game, "5")).toEqual(rightResult);
})

test("Make move as p2 when p1 is gone/temp disconnect but has made their move prior", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: "3", goneOrTemporaryDisconnect: "temporaryDisconnect"},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveCompleteResult = {
    decision: "complete",
    index: 1
  };

  expect(playerMoveLogic("pId2", game, "6")).toEqual(rightResult);
})

test("Make move as p2 before p1 has made their move while they are present", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: null},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMovePartialResult = {
    decision: "partial",
    index: 1
  };

  expect(playerMoveLogic("pId12", game, "6")).toEqual(rightResult);
})

test("Make move as p2 when p1 is gone/temp disconnect but has not made their move prior", () => {
  let game: Game = {
    players: [
      { playerId: "pId1",  username: "user1", move: null, goneOrTemporaryDisconnect: "gone"},
      { playerId: "pId2",  username: "user2", move: null, goneOrTemporaryDisconnect: null}
    ],
    toss: null,
    scoreboard: null
  };

  let rightResult: PlayerMoveFulfillOtherResult = {
    decision: "fulfillOther",
    index: 1,
    otherPlayerIndex: 0
  };

  expect(playerMoveLogic("pId2", game, "5")).toEqual(rightResult);
})