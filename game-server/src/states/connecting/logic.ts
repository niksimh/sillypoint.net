import "dotenv/config";
import jwt from "jsonwebtoken";
import { ConnectionResult } from "./types";

export function connectionLogic(requestURL: string | undefined, secret: string): ConnectionResult {
  if (requestURL === undefined) {
    return { decision: "terminate" };
  }

  let fullURL = new URL(requestURL, "wss://base.url");

  if (fullURL.pathname !== "/wsConnection") {
    return { decision: "terminate" };
  }

  let params = fullURL.searchParams;
  let playerIdToken = params.get("playerIdToken")

  if (playerIdToken === null) {
    return { decision: "terminate" };
  }

  let playerIdTokenPayload;
  try {
    playerIdTokenPayload = jwt.verify(playerIdToken, secret) as jwt.JwtPayload;
  } catch {
    return { decision: "terminate" };
  }
  
  return {
    decision: "add",
    playerId: playerIdTokenPayload.id,
    username: playerIdTokenPayload.username
  }
}