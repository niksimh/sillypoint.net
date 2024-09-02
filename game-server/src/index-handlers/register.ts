import jwt from "jsonwebtoken";
import "dotenv/config";
import { PlayerIdTokenPayload } from "../types";

export let badWordList = [
  "fuck",
  "cunt",
  "shit",
  "ass",
  "arse",
];

export function isAlphaNumeric(str: string) {
  return /^[a-zA-Z0-9]*$/.test(str);
}

export function hasBadWord(str: string, badWordList: string[]) {
  for(let i = 0; i < badWordList.length; i += 1) {
    if(str.toLowerCase().includes(badWordList[i])) {
      return true;
    };
  }
  return false;
}

export default function register(username: string | undefined, playerId: string, randomNumber: number, secret: string) {
  
  if (username === undefined) {
    return { error: true, status: "undefinedUsername"}
  }

  if (username === "") {
    let playerIdPayload = {
      playerId,
      username: `Guest_${randomNumber}`
    }
    let playerIdToken = jwt.sign(playerIdPayload, secret);
    return { error: false, playerIdToken };
  } 

  if (!isAlphaNumeric(username)) {
    return { error: true, status: "notAlphaNumeric"}
  }

  if (hasBadWord(username.toLowerCase(), badWordList)) {
    return { error: true, status: "hasBadWord"};
  }

  if (username.length > 15) {
    return { error: true, status: "tooLong"}
  }

  let playerIdPayload: PlayerIdTokenPayload = {
    playerId,
    username
  }
  let playerIdToken = jwt.sign(playerIdPayload, secret);
  return { error: false, playerIdToken };
}
