import "dotenv/config";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { ConnectionResult, MessageResult } from "./types";
import { PlayerIdTokenPayload } from "../types";


export function connectionLogic(requestURL: string | undefined, secret: string): ConnectionResult {
  if (requestURL === undefined) {
    return { decision: "badConnectionRequest" };
  }

  let fullURL = new URL(requestURL, "wss://base.url");

  if (fullURL.pathname !== "/wsConnection") {
    return { decision: "badConnectionRequest" };
  }

  let params = fullURL.searchParams;
  let playerIdToken = params.get("playerIdToken")

  if (playerIdToken === null) {
    return { decision: "badConnectionRequest" };
  }

  let playerIdTokenPayload;
  try {
    playerIdTokenPayload = (jwt.verify(playerIdToken, secret) as jwt.JwtPayload) as PlayerIdTokenPayload;
  } catch {
    return { decision: "badConnectionRequest" };
  }
  
  return {
    decision: "add",
    playerId: playerIdTokenPayload.playerId,
    username: playerIdTokenPayload.username
  }
}

export function messageLogic(currSeqNum: number, message: string): MessageResult {
  let gameInputSchema = z.object({
    seqNum: z.number(),
    inputContainer: z.object({
      type: z.string(),
      input: z.string()
    })
  });
  
  let parsedMessage;
  try {
    parsedMessage = gameInputSchema.parse(JSON.parse(message));
  } catch {
    return { decision: "leave" };
  }

  if(parsedMessage.seqNum !== currSeqNum) {
    return { decision: "leave" };
  }

  return { decision: "handle", parsedMessage };
}
