'use client';

import Footer from "@/shared/Footer";
import Header from "@/shared/Header";
import PendingState from "./gameStates/pending";

import { useState, useEffect } from "react";
import { GameOutput } from "@/types/io-types";
import { GameSelectionState } from "./gameStates/gameSelection";

export default function GamePage() {
  
  let [gameState, setGameState] = useState("pendingConnection");
  let [gameStateData, setGameStateData] = useState<any>();
  let [socket, setSocket] = useState<WebSocket | null>(null);
  let [seqNum, setSeqNum] = useState<number>(-1);
  
  useEffect(() => {
    function messageFunction(event: MessageEvent) {
      let parsedMessage: GameOutput = JSON.parse(event.data);
      console.log(parsedMessage);
      switch(parsedMessage.type) {
        case "seqNum":
          setSeqNum(parsedMessage.outputContainer.data.seqNum);
          break;
        case "gameState": 
          setGameState(parsedMessage.outputContainer.subType);
          setGameStateData(parsedMessage.outputContainer.data);
          break;
        case "leave":
          setSocket(null);
          setGameState("leave");
          setGameStateData(parsedMessage.outputContainer);
          break;
      }
    }

    //To prevent jarring UI if cnx happens quickly 
    setTimeout(() => {
      if (typeof window === "undefined") {
        return;
      }
  
      let playerIdToken = localStorage.getItem("playerIdToken");
      let wsUrl = "ws://localhost:4000/wsConnection?playerIdToken="+playerIdToken;
  
      let newSocket = new WebSocket(wsUrl);
  
      newSocket.addEventListener("message", messageFunction);
      
      setSocket(newSocket);
    }, 1000);

    return () => {
      socket?.removeEventListener("message", messageFunction);
      socket?.close();
    }
  }, [])

  let renderedGameState;
  switch(gameState) {
    case "pendingConnection": 
      renderedGameState = <PendingState />
      break;
    case "gameSelection":
      renderedGameState = <GameSelectionState socket={socket} seqNum={seqNum}/>;
  }

  return (
    <>
      <Header title="Game"/>
      {renderedGameState}
      <Footer />
    </>
  );
}
