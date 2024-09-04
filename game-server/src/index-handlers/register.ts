import jwt from "jsonwebtoken";
import "dotenv/config";
import { PlayerIdTokenPayload } from "../types";
import { RegisterJSON } from "./types";

export let badWordList = [
  "fuck",
  "cunt",
  "shit",
  "ass",
  "arse",
  "bastard",
  "bitch",
  "whore",
  "nigg",
  "kike",
  "dyke"
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

export default function register(
  username: string | undefined, 
  playerId: string, 
  randomNumber: number, 
  secret: string): RegisterJSON {
  
  if (username === undefined) {
    return { error: true, data: "undefinedUsername"}
  }

  if (username === "") {
    let playerIdPayload: PlayerIdTokenPayload = {
      playerId,
      username: `Guest_${randomNumber}`
    }
    let playerIdToken = jwt.sign(playerIdPayload, secret);
    return { error: false, data: playerIdToken };
  } 

  if (!isAlphaNumeric(username)) {
    return { error: true, data: "notAlphaNumeric"}
  }

  if (hasBadWord(username.toLowerCase(), badWordList)) {
    return { error: true, data: "hasBadWord"};
  }

  if (username.length > 15) {
    return { error: true, data: "tooLong"}
  }

  let playerIdPayload: PlayerIdTokenPayload = {
    playerId,
    username
  }
  let playerIdToken = jwt.sign(playerIdPayload, secret);
  return { error: false, data: playerIdToken };
}
