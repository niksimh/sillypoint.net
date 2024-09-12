'use client'

import { GameInput } from "@/types/io-types";
import { useState } from "react";

export function GameSelectionState({ socket, seqNum} : {socket: WebSocket | null, seqNum: number }) {
  
  let [pending, setPending] = useState(false);

  function selectionClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    
    setPending(true);
    //If disabled, ignore
    let buttonClicked = e.target as HTMLButtonElement;
    if (buttonClicked.disabled) {
      return
    }

    //Disable buttons
    (document.getElementById("publicWaitingRoom") as HTMLButtonElement).disabled = true;
    (document.getElementById("privateWaitingRoomCreator") as HTMLButtonElement).disabled = true;
    (document.getElementById("privateWaitingRoomJoiner") as HTMLButtonElement).disabled = true;
    
    //Process choice
    let choice = buttonClicked.id;

    let input: GameInput = {
      seqNum: seqNum,
      inputContainer: {
        type: "selectGame",
        input: choice 
      }
    }
    
    socket?.send(JSON.stringify(input));
  }
  
  if (pending) {
    return (
      <main>
        <h1 className="loading"></h1>
        <button id="gameSelectionLeave" onClick={selectionClick}>Leave</button>          
      </main>
    )
  }
  return (
    <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center gap-10 ls:gap-5">
        <h1 className="font-bold text-center text-xl sm:text-2xl ls:text-lg">Choose a game mode!</h1>
        <div className="flex flex-col ls:flex-row justify-center items-center gap-5">
          <button 
            id="publicWaitingRoom" 
            onClick={selectionClick}
            className="button font-bold h-12 w-44 sm:w-52 ls:w-40 ls:text-sm"
          >
            Public Game
          </button>
          <button 
            id="privateWaitingRoomCreator" 
            onClick={selectionClick}
            className="button font-bold h-12 w-44 sm:w-52 ls:w-40 ls:text-sm"
          >
            Create Private Game
          </button>
          <button 
            id="privateWaitingRoomJoiner" 
            onClick={selectionClick}
            className="button font-bold h-12 w-44 sm:w-52 ls:w-40 ls:text-sm"
          >
            Join Private Game
          </button>
        </div>
    </main>
  )
}
