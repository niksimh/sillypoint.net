'use client'

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { PlayerIdTokenPayload, GameInput } from "@/types/io-types";

export function TossState(
  { socket, seqNum, gameStateData} : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {

  const [selection, setSelection] = useState<string>();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<any>();
  
  useEffect(() => {
    
    setTimeLeft(Math.min(10, Math.floor((gameStateData.deadline - Date.now())/1000)));
    
    let intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {  
          let newTimeLeft = prevTimeLeft - 1;
    
          if(newTimeLeft === 0) {
            clearInterval(intervalId);
            setSelection("-1");
            return 0;
          } else {
            return newTimeLeft;
          } 
        });
      }, 1000)
      
      setIntervalId(intervalId);

      return () => { 
        setIntervalId((intervalId: number) => {
          clearInterval(intervalId);
          return null;
        });
    }
  },[])

  function selectionClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    
    //If disabled, ignore
    let buttonClicked = e.target as HTMLButtonElement;
    if (buttonClicked.disabled) {
      return
    }

    //Disable buttons
    (document.getElementById("1") as HTMLButtonElement).disabled = true;
    (document.getElementById("2") as HTMLButtonElement).disabled = true;
    (document.getElementById("3") as HTMLButtonElement).disabled = true;
    (document.getElementById("4") as HTMLButtonElement).disabled = true;
    (document.getElementById("5") as HTMLButtonElement).disabled = true;
    (document.getElementById("6") as HTMLButtonElement).disabled = true;

    //Process choice
    let choice = buttonClicked.id;
    setSelection(choice);
    clearInterval(intervalId);

    let input: GameInput = {
      seqNum: seqNum,
      inputContainer: {
        type: "tossPlayerMove",
        input: choice 
      }
    }
    
    socket?.send(JSON.stringify(input));
  }

  //Even/odd determination
  let tossSide; 
  try {
    let playerIdTokenPayload = jwtDecode(localStorage.getItem("playerIdToken")!) as PlayerIdTokenPayload;
    if(gameStateData.evenId === playerIdTokenPayload.playerId) {
      tossSide = "even";
    } else {
      tossSide = "odd";
    }
  } catch {  }

  let selectionOptions;
  if(selection === undefined) {
    selectionOptions = (
      <div className="grid grid-cols-3 md:grid-cols-6 ls:grid-cols-6 gap-5 ls:gap-3">
      <button id="1" onClick={selectionClick}className="button font-bold h-12 w-16 sm:w-24 ls:w-16 ls:text-sm">1</button>
      <button id="2" onClick={selectionClick}className="button font-bold h-12 w-16 sm:w-24 ls:w-16 ls:text-sm">2</button>
      <button id="3" onClick={selectionClick}className="button font-bold h-12 w-16 sm:w-24 ls:w-16 ls:text-sm">3</button>
      <button id="4" onClick={selectionClick}className="button font-bold h-12 w-16 sm:w-24 ls:w-16 ls:text-sm">4</button>
      <button id="5" onClick={selectionClick}className="button font-bold h-12 w-16 sm:w-24 ls:w-16 ls:text-sm">5</button>
      <button id="6" onClick={selectionClick}className="button font-bold h-12 w-16 sm:w-24 ls:w-16 ls:text-sm">6</button>
      </div>
    );
  } else {
    selectionOptions = <h1 className="loading font-bold text-xl sm:text-2xl ls:text-lg"></h1>;
  }

  return (
    <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center gap-10 ls:gap-5 px-12">
      <div className="flex flex-col justify-center items-center gap-3 ls:gap-2">
        <h1 className="font-bold text-center text-xl sm:text-2xl ls:text-lg">{`You are the ${tossSide} player.`}</h1>       
        <h1 className="font-bold text-center text-xl sm:text-2xl ls:text-lg">Make your toss selection!</h1>  
        {
          selection !== undefined ? 
          <h1 className="loading font-bold text-xl sm:text-2xl ls:text-lg"></h1>:
          <></>
        }             
      </div>
      {
        selection === undefined ? 
        <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">{timeLeft}</h1> :
        <></>
      }
      {
        selectionOptions
      }    
    </main>
  );
}

//You're the even/odd player
//Please make your toss selection
//Time left: 
// 1 2 3 4 5 6