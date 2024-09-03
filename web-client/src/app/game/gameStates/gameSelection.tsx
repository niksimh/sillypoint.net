'use client'

import { GameInput } from "@/types/io-types";
import { useState } from "react";

export function GameSelectionState({ socket, seqNum} : {socket: WebSocket | null, seqNum: number }) {
  
  let [pending, setPending] = useState(false);

  function selectionClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    if(pending) {
      return;
    }

    setPending(true);

    let buttonClicked = e.target as HTMLElement;
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
  
  return (
    <main>
        <h1>Please choose a game mode!</h1>
        <div>
          <button id="publicWaitingRoom" onClick={selectionClick}>Public Game</button>
          <button id="privateWaitingRoomCreator" onClick={selectionClick}>Create a Private Game</button>
          <button id="privateWaitingRoomJoiner" onClick={selectionClick}>Join a Private Game</button>
          <button id="badInput" onClick={selectionClick}>Bad Input</button>
        </div>
    </main>
  )
}
