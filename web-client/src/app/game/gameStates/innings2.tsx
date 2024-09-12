
import { jwtDecode } from "jwt-decode";
import { PlayerIdTokenPayload, GameInput } from "@/types/io-types";
import { useState, useEffect } from "react";

export function Selection(
  { socket, seqNum, gameStateData} : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {

  const [selection, setSelection] = useState<string>();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<any>();
  
  useEffect(() => {
    //Clear prev interval, 
    setIntervalId((intervalId: number) => {
      clearInterval(intervalId);
      return null;
    });
    setSelection(undefined);

    //Setup new time
    //Math.min(10, Math.floor((gameStateData.deadline - Date.now())/1000))
    setTimeLeft(1000000);

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
  },[gameStateData])

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
    setIntervalId((intervalId: number) => {
      clearInterval(intervalId);
      return null;
    });

    let input: GameInput = {
      seqNum: seqNum,
      inputContainer: {
        type: "innings2PlayerMove",
        input: choice 
      }
    }
    
    socket?.send(JSON.stringify(input));
  }

  let selectionOptions;
  if(selection === undefined) {
    selectionOptions = (
      <div className="grid grid-cols-3 md:grid-cols-6 ls:grid-cols-6 gap-5 ls:gap-3">
      <button id="1" onClick={selectionClick}className="button font-bold h-12 w-24 ls:w-16 ls:text-sm">1</button>
      <button id="2" onClick={selectionClick}className="button font-bold h-12 w-24 ls:w-16 ls:text-sm">2</button>
      <button id="3" onClick={selectionClick}className="button font-bold h-12 w-24 ls:w-16 ls:text-sm">3</button>
      <button id="4" onClick={selectionClick}className="button font-bold h-12 w-24 ls:w-16 ls:text-sm">4</button>
      <button id="5" onClick={selectionClick}className="button font-bold h-12 w-24 ls:w-16 ls:text-sm">5</button>
      <button id="6" onClick={selectionClick}className="button font-bold h-12 w-24 ls:w-16 ls:text-sm">6</button>
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
      <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">We are currently waiting for the other player!</h1>
    </div>
    );
  }
  
  return (
    <>
      <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">{`${timeLeft}`}</h1> 
      { selectionOptions }
    </>
  );
}

export function Scoreboard({ gameStateData }: { gameStateData: any }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-1 gap-5">
      <div>
        <h1>Target</h1>
        <h2 className="grow">{gameStateData.scoreboard.target}</h2>
      </div>
      <div className="flex flex-col gap-5">
        <h1>Runs</h1>
        <h2 className="grow">{gameStateData.scoreboard.runs}</h2>
      </div>
      <div className="flex flex-col gap-5">
        <h1>Wickets</h1>
        <h2 className="grow">{gameStateData.scoreboard.wickets}</h2>
      </div>
      <div className="flex flex-col gap-5">
        <h1>Balls</h1>
        <h2 className="grow">{gameStateData.scoreboard.balls}</h2>
      </div>
    </div>
  );
}

export function Innings2State(
  { socket, seqNum, gameStateData} : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {

  //Even/odd determination
  let side; 
  try {
    let playerIdTokenPayload = jwtDecode(localStorage.getItem("playerIdToken")!) as PlayerIdTokenPayload;
    if(gameStateData.scoreboard.batterId === playerIdTokenPayload.playerId) {
      side = "batting";
    } else {
      side = "bowling";
    }
  } catch {  }

  return (
    <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center gap-10 ls:gap-3 px-12">
      <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">{`You are currently ${side}.`}</h1>
      <Scoreboard gameStateData={gameStateData} />
      <Selection socket={socket} seqNum={seqNum} gameStateData={gameStateData} />
    </main>
  );
}