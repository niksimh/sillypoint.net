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

    let input: GameInput;
    if(choice === "gameSelectionLeave") {
      input = {
        seqNum: seqNum,
        inputContainer: {
          type: "gameSelectionLeave",
          input: "deliberate" 
        }
      }
    } else {
      input = {
        seqNum: seqNum,
        inputContainer: {
          type: "selectGame",
          input: choice 
        }
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
    <main>
        <h1>Please choose a game mode!</h1>
        <div>
          <button id="publicWaitingRoom" onClick={selectionClick}>Public Game</button>
          <br />
          <button id="privateWaitingRoomCreator" onClick={selectionClick}>Create a Private Game</button>
          <br />
          <button id="privateWaitingRoomJoiner" onClick={selectionClick}>Join a Private Game</button>
          <br />
          <button id="gameSelectionLeave" onClick={selectionClick}>Leave</button>          
        </div>
    </main>
  )
}
