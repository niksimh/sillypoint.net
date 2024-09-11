'use client';

import { GameInput, PlayerIdTokenPayload } from "@/types/io-types";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";


export function NotWinner() {  
    return (
      <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center gap-10 ls:gap-7 px-12">        
        <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">Unfortunately, you did not win the toss.</h1>
        <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">Please wait while the winner makes their selection.</h1>
      </main>
    )
}

export function AmWinner(
  { socket, seqNum, gameStateData} : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {
  
  const [selection, setSelection] = useState<string>();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<any>();
  
  useEffect(() => {
    //Math.min(10, Math.floor((gameStateData.deadline - Date.now())/1000))
    setTimeLeft(10000);
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
  },[]);

  function selectionClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    
    //If disabled, ignore
    let buttonClicked = e.target as HTMLButtonElement;
    if (buttonClicked.disabled) {
      return
    }

    //Disable buttons
    (document.getElementById("bat") as HTMLButtonElement).disabled = true;
    (document.getElementById("bowl") as HTMLButtonElement).disabled = true;

    //Process choice
    let choice = buttonClicked.id;
    setSelection(choice);
    setIntervalId((intervalId: number) => {
      clearInterval(intervalId);
      return null;
    });

    let input: GameInput = {
      seqNum: seqNum,
      inputContainer: {
        type: "tossWinnerSelectionPlayerMove",
        input: choice 
      }
    }
    
    socket?.send(JSON.stringify(input));
  }

  let selectionOptions;
  if(selection === undefined) {
    selectionOptions = (
      <div className="grid grid-cols-1 ls:grid-cols-2 gap-5 ls:gap-3">
        <button id="bat" onClick={selectionClick}className="button font-bold h-12 w-24 ls:w-16 ls:text-sm">Bat</button>
        <button id="bowl" onClick={selectionClick}className="button font-bold h-12 w-24 ls:w-16 ls:text-sm">Bowl</button>
      </div>
    );
  } else if (selection === "-1") {
    selectionOptions = (
    <div className="flex flex-col ls:flex-row justify-center items-center gap-10 ls:gap-3">
      <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">Oh no! Time ran out!</h1>
      <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">The computer has made a move for you.</h1>
    </div>
    );
  } else {
    selectionOptions = (
    <div className="flex flex-col ls:flex-row justify-center items-center gap-10 ls:gap-3">
      <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">{`You have selected ${selection}.`}</h1>      
    </div>
    );
  }

  return (
    <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center gap-10 ls:gap-3 px-12">
      <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">You have won the toss!</h1>
      <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">Would you like to bat or bow first?</h1>
    {
      selection === undefined ? 
      <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">{timeLeft}</h1> :
      <></>
    }
    {selectionOptions}    
    </main>
  );

}

export function TossWinnerSelectionState(
  { socket, seqNum, gameStateData} : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {

  //Winner determination
  let amWinner; 
  try {
    let playerIdTokenPayload = jwtDecode(localStorage.getItem("playerIdToken")!) as PlayerIdTokenPayload;
    if(gameStateData.winnerId === playerIdTokenPayload.playerId) {
      amWinner = true;
    } else {
      amWinner = false;
    }
  } catch {  }


  if (amWinner) {
    return <AmWinner socket={socket} seqNum={seqNum} gameStateData={gameStateData} />
  }
  return <NotWinner />
}

