import { Game } from "../../game-engine/types";
import { ComputerMoveResult, PlayerMoveResult } from "./types";


export function playerMoveLogic(playerId: string, game: Game, input: string): PlayerMoveResult {
  if (input !== "bat" && input !== "bowl") {
    return { decision: "badMove" };
  }

  let tossContainer = game.toss!;
  if (tossContainer.winnerId !== playerId) {
    return { decision: "badMove" };
  }

  let players = game.players;
  if (players[0].playerId === playerId) {
    return { decision: "complete", index: 0};
  }
  return { decision: "complete", index: 1};
}

export function computerMoveLogic(game: Game): ComputerMoveResult {
  let players = game.players;
  let tossContainer = game.toss!;
  let tossWinnerId = tossContainer.winnerId!;
  
  if (players[0].playerId === tossWinnerId) {
    return { decision: "0" };
  }
  return { decision: "1" };
}
