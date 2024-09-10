'use client'

import { GameInput } from "@/types/io-types";
import { useState } from "react";

export function PublicWaitingRoomState({ socket, seqNum} : {socket: WebSocket | null, seqNum: number }) {
  
  const [pending, setPending] = useState(false);
  
  function selectionClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    
    setPending(true);
    //If disabled, ignore
    let buttonClicked = e.target as HTMLButtonElement;
    if (buttonClicked.disabled) {
      return
    }

    //Disable button
    (document.getElementById("gameSelectionLeave") as HTMLButtonElement).disabled = true;
    
    let input: GameInput = {
      seqNum: seqNum,
      inputContainer: {
        type: "publicWaitingRoomLeave",
        input: "deliberate" 
      }
    }

    socket?.send(JSON.stringify(input));
  }
  
  if(pending) {
    return (
      <main>
        <h1>Leaving</h1>
        <h2 className="loading"></h2>
      </main>
    )
  } 
  return (
    <main>
        <h1>Looking for a game!</h1>
        <h2 className="loading"></h2>
        <button id="gameSelectionLeave" onClick={selectionClick}>Leave</button>    
    </main>
  )
}
