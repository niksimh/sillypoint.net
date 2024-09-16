import { WebSocket } from "ws";

import { Player } from "@/player-db/types";
import { transitionIntoLogic } from "@/states/connecting/logic";
import { TransitionIntoResult } from "@/states/connecting/types";

test("Connecting with undefined player", () => {
  let rightResult: TransitionIntoResult = {
    decision: "add"
  };

  expect(transitionIntoLogic(undefined)).toEqual(rightResult);
})

test("Connecting with defined player that has null socket", () => {
  let rightResult: TransitionIntoResult = {
    decision: "rejoin"
  };

  let player: Player = {
    username: "user1",
    socket: null, 
    status: "someState"
  };

  expect(transitionIntoLogic(player)).toEqual(rightResult);
})

test("Connecting with defined player that has defined socket", () => {
  let rightResult: TransitionIntoResult = {
    decision: "close"
  };

  let player: Player = {
    username: "user1",
    socket: {} as any as WebSocket, 
    status: "someState"
  };

  expect(transitionIntoLogic(player)).toEqual(rightResult);
})
