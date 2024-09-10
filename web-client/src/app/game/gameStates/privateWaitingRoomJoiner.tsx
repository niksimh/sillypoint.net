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
      let roomId = (document.getElementById("roomIdBox") as HTMLInputElement).value;
      (document.getElementById("roomIdBox") as HTMLInputElement).value = "";

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
        additionalMessage = "There does not exist a game with the code you entered";
        break;
      case "fullRoom":
        additionalMessage = "The game with the code you entered is full";
        break;
    }

    return (
      <main>
      <form onSubmit={submitHandler}>
        <label htmlFor="roomIdBox">Enter the code of the game you want to join!</label>
        <br />
        <input type="text" id="roomIdBox" name="roomIdBox" />
        <br />
        { additionalMessage }
        <br />
        <input type="submit" id="submitInput" value="submit" />
        </form>
    </main>
    )
}

export function Joined(
  { socket, seqNum, gameStateData} : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {
    return <h1>Hi</h1>
}

export function PrivateWaitingRoomJoinerState(
  { socket, seqNum, gameStateData} : {socket: WebSocket | null, seqNum: number, gameStateData: any }) {

  if (gameStateData.status === "joined") {
    return <Joined socket={socket} seqNum={seqNum} gameStateData={gameStateData} />
  }
  return <PreJoin socket={socket} seqNum={seqNum} gameStateData={gameStateData} />
}