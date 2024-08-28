import Connecting from "./connecting/connecting";
import GameSelection from "./game-selection/game-selection";
import PublicWaitingRoom from "./public-waiting-room/public-waiting-room"
import PrivateWaitingRoom from "./private-waiting-room/private-waiting-room";
import Lobby from "./lobby/lobby";
import Toss from "./toss/toss";
import TossWinnerSelection from "./toss-winner-selection/toss-winner-selection";
import Innings1 from "./innings-1/innings-1";
import InningsBreak from "./innings-break/innings-break";
import Innings2 from "./innings-2/innings-2";
import GameOver from "./game-over/game-over";

import type { State } from "./types";
import type PlayerDB from "../player-db/player-db";
import type RelayService from "../relay-service/relay-service";

export default function setupStates(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
  let connectingState = new Connecting(stateMap, playerDB, relayService);
  stateMap.set("connecting", connectingState); 

  let gameSelectionState = new GameSelection(stateMap, playerDB, relayService);
  stateMap.set("gameSelection", gameSelectionState);

  let publicWaitingRoomState = new PublicWaitingRoom(stateMap, playerDB, relayService);
  stateMap.set("publicWaitingRoom", publicWaitingRoomState);

  let privateWaitingRoomState= new PrivateWaitingRoom(stateMap, playerDB);
  stateMap.set("privateWaitingRoom", privateWaitingRoomState);

  let lobbyState = new Lobby(stateMap, playerDB);
  stateMap.set("lobby", lobbyState);

  let tossState = new Toss(stateMap, playerDB);
  stateMap.set("tossState", tossState);

  let tossWinnerSelectionState = new TossWinnerSelection(stateMap, playerDB);
  stateMap.set("tossWinnerSelection", tossWinnerSelectionState);

  let innings1State = new Innings1(stateMap, playerDB);
  stateMap.set("innings1", innings1State);

  let inningsBreakState = new InningsBreak(stateMap, playerDB);
  stateMap.set("inningsBreak", inningsBreakState);

  let innings2State = new Innings2(stateMap, playerDB);
  stateMap.set("innings2", innings2State);

  let gameOverState = new GameOver(stateMap, playerDB);
  stateMap.set("gameOver", gameOverState);
}
