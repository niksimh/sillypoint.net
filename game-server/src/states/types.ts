import type Connecting from "./connecting/connecting";
import type GameSelection from "./game-selection/game-selection";
import type PublicWaitingRoom from "./public-waiting-room/public-waiting-room"
import type PrivateWaitingRoom from "./private-waiting-room/private-waiting-room";
import type Lobby from "./lobby/lobby";
import type Toss from "./toss/toss";
import type TossWinnerSelection from "./toss-winner-selection/toss-winner-selection";
import type Innings1 from "./innings-1/innings-1";
import type InningsBreak from "./innings-break/innings-break";
import type Innings2 from "./innings-2/innings-2";
import type GameOver from "./game-over/game-over";

export type State = 
  Connecting |
  GameSelection |
  PublicWaitingRoom |
  PrivateWaitingRoom |
  Lobby | 
  Toss | 
  TossWinnerSelection | 
  Innings1 | 
  InningsBreak | 
  Innings2 | 
  GameOver
