import { messageLogic } from "../../relay-service/logic";

test("Handle message from unkown player", () => {
  expect(messageLogic(undefined, "hi")).toEqual({ decision: "ignore" });
})

test("Handle message when player is in state 'connecting'", () => {
  const player = {
    username: "user",
    socketId: "sId",
    status: "connecting"
  }
  expect(messageLogic(player, "hi")).toEqual({ decision: "ignore" });
})

test("Handle message when player is in state 'gameOver'", () => {
  const player = {
    username: "user",
    socketId: "sId",
    status: "gameOver"
  }
  expect(messageLogic(player, "hi")).toEqual({ decision: "ignore" });
})

test("Handle valid message", () => {
  const player = {
    username: "user",
    socketId: "sId",
    status: "innings1"
  }
  expect(messageLogic(player, "hi")).toEqual({ 
    decision: "handle",
    state: "innings1",
    message: "hi"
  });
})