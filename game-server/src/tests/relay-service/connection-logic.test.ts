import { connectionLogic } from "../../relay-service/logic";
import jwt from "jsonwebtoken";
import { PlayerIdTokenPayload } from "../../types";

const CORRECT_URL = "/wsConnection";
const SECRET = "$ecret"
const PLAYER_ID_TOKEN_PAYLOAD: PlayerIdTokenPayload = {
  playerId: "pId",
  username: "user"
}

test("Connecting with an undefined url", () => {
  let connectionLogicResult = connectionLogic(undefined, SECRET);
  expect(connectionLogicResult).toEqual({ decision: "badConnectionRequest" });
})

test("Connecting with a bad url", () => {
  let connectionLogicResult = connectionLogic("/badURL", SECRET);
  expect(connectionLogicResult).toEqual({ decision: "badConnectionRequest" });
})

test("Connecting with an absent playerIdToken query parameter", () => {
  let connectionLogicResult = connectionLogic(CORRECT_URL, SECRET);
  expect(connectionLogicResult).toEqual({ decision: "badConnectionRequest" });
})

test("Connecting with a bad playerIdToken query parameter", () => {
  let newPlayerIdToken = jwt.sign(PLAYER_ID_TOKEN_PAYLOAD, 'badSecret');
  let connectionLogicResult = connectionLogic(CORRECT_URL+'?playerIdToken='+newPlayerIdToken, SECRET);
  expect(connectionLogicResult).toEqual({ decision: "badConnectionRequest" });
})

test("Connecting with a good playerIdToken query parameter", () => {
  let newPlayerIdToken = jwt.sign(PLAYER_ID_TOKEN_PAYLOAD, SECRET);
  let connectionLogicResult = connectionLogic(CORRECT_URL+'?playerIdToken='+newPlayerIdToken, SECRET);
  expect(connectionLogicResult).toEqual({ 
    decision: "add",
    playerId: PLAYER_ID_TOKEN_PAYLOAD.playerId,
    username: PLAYER_ID_TOKEN_PAYLOAD.username
  });
})
