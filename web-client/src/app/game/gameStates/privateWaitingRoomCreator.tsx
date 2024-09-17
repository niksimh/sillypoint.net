import { GameInput } from "@/types/io-types";
import { useEffect } from "react";

export function PreJoin(
  { gameStateData } : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {
    
    return (
      <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center gap-5">
        <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">Room ID</h1>
        <h2 className="font-bold text-xl sm:text-2xl ls:text-lg">{gameStateData.roomId}</h2>
      </main>
    );
}

export function Joined(
  { socket, seqNum, gameStateData} : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {
    
    useEffect(() => {
      (document.getElementById("kick") as HTMLButtonElement).disabled = false;
      (document.getElementById("startGame") as HTMLButtonElement).disabled = false;      
    }, [gameStateData])

    function selectionClick(e: React.MouseEvent<HTMLElement>) {
      e.preventDefault();
      
      //If disabled, ignore
      let buttonClicked = e.target as HTMLButtonElement;
      if (buttonClicked.disabled) {
        return;
      }
  
      //Disable buttons
      (document.getElementById("kick") as HTMLButtonElement).disabled = true;
      (document.getElementById("startGame") as HTMLButtonElement).disabled = true;      
      
      //Process choice
      let choice = buttonClicked.id;
  
      let input: GameInput = {
        seqNum: seqNum,
        inputContainer: {
          type: choice,
          input: "" 
        }
      }
      
      socket?.send(JSON.stringify(input));
    }

    return (
      <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center gap-10 ls:gap-5 px-12">
        <div>
        <div className="flex flex-col justify-center items-center gap-3 ls:gap-2">
          <h1 className="pink font-bold text-xl sm:text-2xl ls:text-lg">You</h1>
          <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">vs</h1>
          <h1 className="pink font-bold text-xl sm:text-2xl ls:text-lg">{gameStateData.otherPlayerUsername}</h1>
        </div>
        </div>
          <div className="flex flex-col ls:flex-row justify-center items-center gap-5">
            <button 
              id="kick" 
              onClick={selectionClick}
              className="button font-bold h-12 w-44 sm:w-52 ls:w-40 ls:text-sm"
            >
              Kick
            </button>
            <button 
              id="startGame" 
              onClick={selectionClick}
              className="button font-bold h-12 w-44 sm:w-52 ls:w-40 ls:text-sm"
            >
              Start Game!
            </button>
          </div>
      </main>
    );
}

export function PrivateWaitingRoomCreatorState(
  { socket, seqNum, gameStateData} : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {

  if (gameStateData.otherPlayerUsername) {
    return <Joined socket={socket} seqNum={seqNum} gameStateData={gameStateData} />
  }
  return <PreJoin socket={socket} seqNum={seqNum} gameStateData={gameStateData} />
}
