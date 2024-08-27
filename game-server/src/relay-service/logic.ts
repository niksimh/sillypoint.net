import type { connectionResult, messageResult } from "./types"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { Player } from "../player-db/types";

export function connectionLogic(requestURL: string | undefined, socketId: string, secret: string): connectionResult {
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
    player: {
      username: playerIdTokenPayload.username,
      socketId: socketId,
      status: "connecting"
    }
  }
}

export function messageLogic(currPlayer: Player | undefined, message: string): messageResult {
  if (currPlayer === undefined) {
    return { decision: "ignore" };
  }
  if (currPlayer.status === "connecting" || currPlayer.status === "gameOver") {
    return { decision: "ignore" };
  }
  return {
    decision: "handle",
    state: currPlayer.status,
    message: message
  }
}
