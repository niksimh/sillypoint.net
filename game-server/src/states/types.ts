import type Connecting from "@/states/connecting/connecting";
import type GameSelection from "@/states/game-selection/game-selection";
import type PublicWaitingRoom from "@/states/public-waiting-room/public-waiting-room"
import type PrivateWaitingRoom from "@/states/private-waiting-room/private-waiting-room";
import type Lobby from "@/states/lobby/lobby";
import type Toss from "@/states/toss/toss";
import type TossWinnerSelection from "@/states/toss-winner-selection/toss-winner-selection";
import type Innings1 from "@/states/innings-1/innings-1";
import type InningsBreak from "@/states/innings-break/innings-break";
import type Innings2 from "@/states/innings-2/innings-2";
import type GameOver from "@/states/game-over/game-over";

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
