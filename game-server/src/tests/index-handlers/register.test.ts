import jwt from "jsonwebtoken"

import register, { isAlphaNumeric, hasBadWord, badWordList } from "@/index-handlers/register"

import { PlayerIdTokenPayload } from "@/index-handlers/types";

const PLAYER_ID = "abc";
const RANDOM_NUMBER = 100;
const BAD_WORD_LIST = badWordList;
const SECRET = "$ECRET";

test("Check that valPLAYER_ID alphanumberic string is alphanumeric", () => {
  let str = "abcABC123";
  expect(isAlphaNumeric(str)).toEqual(true);
})

test("Check that invalPLAYER_ID alphanumberic string is not alphanumeric", () => {
  let str = "abcABC123!";
  expect(isAlphaNumeric(str)).toEqual(false);
})

test("Catch bad word at the start of username", () => {
  let badUsername = "fuckend";
  expect(hasBadWord(badUsername, BAD_WORD_LIST)).toEqual(true);
})

test("Catch bad word in the mPLAYER_IDdle of username", () => {
  let badUsername = "startfuckend";
  expect(hasBadWord(badUsername, BAD_WORD_LIST)).toEqual(true);
})

test("Catch bad word in capital letters", () => {
  let badUsername = "startFUCKend";
  expect(hasBadWord(badUsername, BAD_WORD_LIST)).toEqual(true);
})

test("Catch different bad words", () => {
  BAD_WORD_LIST.forEach(badWord => {
    let badUsername = `start${badWord}end`;  
    expect(hasBadWord(badUsername, BAD_WORD_LIST)).toEqual(true);
  });
})

test("Check username without bad words for bad words", () => {
  let notBadUsername = "startend";
  expect(hasBadWord(notBadUsername, BAD_WORD_LIST)).toEqual(false);
})

test("Register with undefined username", () => {
  let username = undefined;
  
  let registrationResult = register(username, PLAYER_ID, RANDOM_NUMBER, SECRET);

  expect(registrationResult.error).toEqual(true);
  expect(registrationResult.data).toEqual("undefinedUsername");
})

test("Register with blank username", () => {
  let username = "";
  let registrationResult = register(username, PLAYER_ID, RANDOM_NUMBER, SECRET);
  
  expect(registrationResult.error).toEqual(false);

  let payload = jwt.verify(registrationResult.data!, SECRET) as jwt.JwtPayload as PlayerIdTokenPayload;
  expect(payload.playerId).toEqual(PLAYER_ID);
  expect(payload.username).toEqual(`Guest_${RANDOM_NUMBER}`);
})

test("Register with username that is not alphanumeric", () => {
  let username = "username!";
  let registrationResult = register(username, PLAYER_ID, RANDOM_NUMBER, SECRET);
  
  expect(registrationResult.error).toEqual(true);
  expect(registrationResult.data).toEqual("notAlphaNumeric");
})

test("Register with username that has bad word", () => {
  let username = "usernameFuck";
  let registrationResult = register(username, PLAYER_ID, RANDOM_NUMBER, SECRET);
  
  expect(registrationResult.error).toEqual(true);
  expect(registrationResult.data).toEqual("hasBadWord");
})

test("Register with username that is more than 15 characters", () => {
  let username = "usernameusernameusername";
  let registrationResult = register(username, PLAYER_ID, RANDOM_NUMBER, SECRET);
  
  expect(registrationResult.error).toEqual(true);
  expect(registrationResult.data).toEqual("tooLong");
})

test("Register with valid username", () => {
  let username = "myUsername";
  let registrationResult = register(username, PLAYER_ID, RANDOM_NUMBER, SECRET);
  
  expect(registrationResult.error).toEqual(false);

  let payload = jwt.verify(registrationResult.data!, SECRET) as jwt.JwtPayload as PlayerIdTokenPayload;
  expect(payload.playerId).toEqual(PLAYER_ID);
  expect(payload.username).toEqual(username);
})
