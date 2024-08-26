import type Connecting from "./connecting"
import type GameOver from "./game-over"
import type GameSelection from "./game-selection"
import type Innings1 from "./innings-1"
import type Innings2 from "./innings-2"
import type InningsBreak from "./innings-break"
import type Lobby from "./lobby"
import type PrivateWaitingRoom from "./private-waiting-room"
import type PublicWaitingRoom from "./public-waiting-room"
import type Toss from "./toss"
import type TossWinnerSelection from "./toss-winner-selection"

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
