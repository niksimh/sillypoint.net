'use client';

import { GameInput } from "@/types/io-types";
import { useEffect } from "react";


export function PreJoin(
  { socket, seqNum, gameStateData} : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {

    function submitHandler(e: React.FormEvent<HTMLFormElement>) {
      //Prevent default 
      e.preventDefault();
      
      let submitInput = (document.getElementById("submitInput") as HTMLInputElement);

      //If event was placed on queue before disabling, noop
      if (submitInput.disabled) {
        return;
      }

      //Prevent further form submissions and also setup pending status
      submitInput.disabled = true;
      
      //Get the entered username and setup fetch url
      let roomIdBox = document.getElementById("roomIdBox") as HTMLInputElement;
      let roomId = roomIdBox.value;
      roomIdBox.value = "";

      //If not number, show error
      if(Number.isNaN(Number(roomId))) {
        document.getElementById("aM")!.innerText = "The room number you enter should be a number"
        document.getElementById("aM")!.className += "text-center underline font-bold";
        submitInput.disabled = false;
        return;
      }

      let input: GameInput = {
        seqNum,
        inputContainer: {
          type: "join",
          input: roomId
        }
      }

      socket?.send(JSON.stringify(input));
    }

    useEffect(() => {
      (document.getElementById("submitInput") as HTMLInputElement).disabled = false;
    }, [gameStateData]);

    let additionalMessage;
    switch(gameStateData.status) {
      case "pending":
        additionalMessage = "";
        break;
      case "badRoom":
        additionalMessage = "There does not exist a room with the code you entered";
        break;
      case "fullRoom":
        additionalMessage = "The room with the code you entered is full";
        break;
    }

    return (
      <main className="h-[80dvh] ls:h-[75dvh] flex justify-center items-center px-12">
      <form onSubmit={submitHandler} className="flex flex-col justify-center items-center gap-10 ls:gap-5">
        <label 
          htmlFor="roomIdBox"
          className="text-center font-bold text-xl sm:text-2xl ls:text-lg"
        >
          <span>Enter a room id!</span>
        </label>
        <div className="flex justify-center items-center gap-9">
          <input 
            type="text" id="roomIdBox" name="roomIdBox"          
            className="black font-bold rounded h-12 w-52 sm:w-72 p-5"
          /> 
          <input 
            className="button button-translate font-bold h-12 w-20 sm:w-24" 
            type="submit" 
            id="submitInput" 
            value="Submit"
           />
        </div>  
        {
          additionalMessage ?
          <span id="aM" className="white text-center underline font-bold">{ additionalMessage }</span> :
          <span id="aM" className="white">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        }
        
      </form>
    </main>
    )
}

export function Joined(
  { gameStateData } : { gameStateData: any }) {  
    return (
      <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center gap-10 ls:gap-5 px-12">
        <div className="flex flex-col justify-center items-center gap-3 ls:gap-2">
          <h1 className="pink font-bold text-xl sm:text-2xl ls:text-lg">You</h1>
          <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">vs</h1>
          <h1 className="pink font-bold text-xl sm:text-2xl ls:text-lg">{gameStateData.otherPlayerUsername}</h1>
        </div>
        <h1 className="font-bold text-center text-xl sm:text-2xl ls:text-lg">
          Waiting for the creator of the room to start the game!
        </h1>
      </main>
    )
}

export function PrivateWaitingRoomJoinerState(
  { socket, seqNum, gameStateData} : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {

  if (gameStateData.status === "joined") {
    return <Joined gameStateData={gameStateData} />
  }
  return <PreJoin socket={socket} seqNum={seqNum} gameStateData={gameStateData} />
}

