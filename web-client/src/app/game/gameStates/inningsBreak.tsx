import { PlayerIdTokenPayload } from "@/types/io-types";
import { jwtDecode } from "jwt-decode";

export function InningsBreakState(
  { gameStateData }: { gameStateData: any }) {

    let nextBatterUsername = ""; 
    try {
      let playerIdTokenPayload = jwtDecode(localStorage.getItem("playerIdToken")!) as PlayerIdTokenPayload;
      if(gameStateData.nextBatterId === playerIdTokenPayload.playerId) {
        nextBatterUsername = "You are";
      } else {
        if(gameStateData.p1.playerId === gameStateData.nextBatterId) {
          nextBatterUsername = gameStateData.p1.username+" is"; 
        } else {
          nextBatterUsername = gameStateData.p2.username+" is"; 
        }
      }
    } catch {

    }
    
    return (
    <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center gap-3 ls:gap-2 px-12">      
      <h1 className="pink text-center font-bold text-xl sm:text-2xl ls:text-lg">{`${nextBatterUsername} batting next.`}</h1>
      <h1 className="font-bold text-center text-xl sm:text-2xl ls:text-lg">{`${gameStateData.target} is needed to win.`}</h1>
      <h1 className="pink text-center font-bold text-xl sm:text-2xl ls:text-lg">Innings 2 will start shortly!</h1>
    </main>
  );
}
