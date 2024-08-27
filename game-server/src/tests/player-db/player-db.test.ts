import PlayerDB from "../../player-db/player-db";
import type { WebSocket } from "ws";

test("Add new player when they are not present", () => {
  let playerDB = new PlayerDB();

  playerDB.addPlayer("abc", {
    username: "user",
    socket: {} as WebSocket,
    status: "a"
  });

  expect(playerDB.hasPlayer("abc")).toEqual(true);
})

test("Add new player when they are present", () => {
  let playerDB = new PlayerDB();

  playerDB.addPlayer("abc", {
    username: "user",
    socket: {} as WebSocket,
    status: "a"
  });

  playerDB.addPlayer("abc", {
    username: "user2",
    socket: {} as WebSocket,
    status: "b"
  });

  expect(playerDB.hasPlayer("abc")).toEqual(true);
  expect(playerDB.getPlayer("abc")).toEqual({
    username: "user",
    socket: {},
    status: "a"
  })
})
