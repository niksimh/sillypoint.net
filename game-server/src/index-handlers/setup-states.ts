import Connecting from "../states/connecting";
import GameSelection from "../states/game-selection";
import PublicWaitingRoom from "../states/public-waiting-room";
import PrivateWaitingRoom from "../states/private-waiting-room";
import Lobby from "../states/lobby";
import Toss from "../states/toss";
import TossWinnerSelection from "../states/toss-winner-selection";
import Innings1 from "../states/innings-1";
import InningsBreak from "../states/innings-break";
import Innings2 from "../states/innings-2";
import GameOver from "../states/game-over";

import type { State } from "../states/types";
import type PlayerDB from "../player-db/player-db";
import type RelayService from "../relay-service/relay-service";

export default function setupStates(stateMap: Map<string, State>, playerDB: PlayerDB, relayService: RelayService) {
  let connectingState = new Connecting(stateMap, playerDB);
  stateMap.set("connecting", connectingState); 

  let gameSelectionState = new GameSelection(stateMap, playerDB, relayService);
  stateMap.set("gameSelection", gameSelectionState);

  let publicWaitingRoomState = new PublicWaitingRoom(stateMap, playerDB);
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
