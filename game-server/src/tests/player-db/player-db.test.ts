import PlayerDB from "../../player-db/player-db";

test("Add new player when they are not present", () => {
  let playerDB = new PlayerDB();

  playerDB.addPlayer("abc", {
    username: "user",
    socketId: "sId",
    status: "a"
  });

  expect(playerDB.hasPlayer("abc")).toEqual(true);
})

test("Add new player when they are present", () => {
  let playerDB = new PlayerDB();

  playerDB.addPlayer("abc", {
    username: "user",
    socketId: "sId",
    status: "a"
  });

  playerDB.addPlayer("abc", {
    username: "user2",
    socketId: "sId2",
    status: "b"
  });

  expect(playerDB.hasPlayer("abc")).toEqual(true);
  expect(playerDB.getPlayer("abc")).toEqual({
    username: "user",
    socketId: "sId",
    status: "a"
  })
})
