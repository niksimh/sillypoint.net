import { PlayerIdTokenPayload } from "@/types/io-types";
import { jwtDecode } from "jwt-decode";

export default function LobbyState(
  { gameStateData }: { gameStateData: any }) {

    let otherPlayerUsername = ""; 
    try {
      let playerIdTokenPayload = jwtDecode(localStorage.getItem("playerIdToken")!) as PlayerIdTokenPayload;
      console.log(playerIdTokenPayload);
      if(gameStateData.p1.playerId === playerIdTokenPayload.playerId) {
        otherPlayerUsername = gameStateData.p2.username;
      } else {
        otherPlayerUsername = gameStateData.p1.username; 
      }
    } catch {

    }
    
    return (
    <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center gap-10 ls:gap-5 px-12">
      <div className="flex flex-col justify-center items-center gap-3 ls:gap-2">
        <h1 className="pink font-bold text-xl sm:text-2xl ls:text-lg">You</h1>
        <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">vs</h1>
        <h1 className="pink font-bold text-xl sm:text-2xl ls:text-lg">{otherPlayerUsername}</h1>
      </div>
      <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">
        The game will begin shortly!
      </h1>
    </main>
  );
}
