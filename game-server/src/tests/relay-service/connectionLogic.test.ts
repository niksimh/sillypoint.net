import { connectionLogic } from "../../relay-service/logic";
import type { connectionResult } from "../../relay-service/types";
import jwt from "jsonwebtoken";

const CORRECT_URL = "/wsConnection";
const SOCKET_ID = "sId";
const SECRET = "$ecret"
const PLAYER_ID_TOKEN_PAYLOAD = {
  id: "pId",
  username: "user"
}

test("Connecting with an undefined url", () => {
  let connectionLogicResult = connectionLogic(undefined, SOCKET_ID, SECRET);
  expect(connectionLogicResult).toEqual({ decision: "terminate" });
})

test("Connecting with a bad url", () => {
  let connectionLogicResult = connectionLogic("/badURL", SOCKET_ID, SECRET);
  expect(connectionLogicResult).toEqual({ decision: "terminate" });
})

test("Connecting with an absent playerIdToken query parameter", () => {
  let connectionLogicResult = connectionLogic(CORRECT_URL, SOCKET_ID, SECRET);
  expect(connectionLogicResult).toEqual({ decision: "terminate" });
})

test("Connecting with a bad playerIdToken query parameter", () => {
  let newPlayerIdToken = jwt.sign(PLAYER_ID_TOKEN_PAYLOAD, 'badSecret');
  let connectionLogicResult = connectionLogic(CORRECT_URL+'?playerIdToken='+newPlayerIdToken, SOCKET_ID, SECRET);
  expect(connectionLogicResult).toEqual({ decision: "terminate" });
})

test("Connecting with a good playerIdToken query parameter", () => {
  let newPlayerIdToken = jwt.sign(PLAYER_ID_TOKEN_PAYLOAD, SECRET);
  let connectionLogicResult = connectionLogic(CORRECT_URL+'?playerIdToken='+newPlayerIdToken, SOCKET_ID, SECRET);
  expect(connectionLogicResult).toEqual({ 
    decision: "add",
    playerId: PLAYER_ID_TOKEN_PAYLOAD.id,
    player: {
      username: PLAYER_ID_TOKEN_PAYLOAD.username,
      socketId: SOCKET_ID,
      status: "connecting"
    }
  });
})
