'use client';

import { useState, useEffect } from "react";

import Footer from "@/app/shared/Footer";
import GameHeader from "@/app/shared/GameHeader";
import Header from "@/app/shared/Header";
import PendingState from "@/app/game/gameStates/pending";

import { GameOutput } from "@/types/io-types";
import { GameSelectionState } from "@/app/game/gameStates/gameSelection";
import { PublicWaitingRoomState } from "@/app/game/gameStates/publicWaitingRoom";
import { PrivateWaitingRoomJoinerState } from "@/app/game/gameStates/privateWaitingRoomJoiner";
import { PrivateWaitingRoomCreatorState } from "@/app/game/gameStates/privateWaitingRoomCreator";
import { LobbyState } from "@/app/game/gameStates/lobby";
import { TossState } from "@/app/game/gameStates/toss";
import { TossWinnerSelectionState } from "@/app/game/gameStates/tossWinnerSelection";
import { Innings1State } from "@/app/game/gameStates/innings1";
import { InningsBreakState } from "@/app/game/gameStates/inningsBreak";
import { Innings2State } from "@/app/game/gameStates/innings2";
import { LeaveState } from "@/app/game/gameStates/leave";

export default function GamePage() {
  
  let [gameState, setGameState] = useState("pendingConnection");
  let [gameStateData, setGameStateData] = useState<any>();
  let [socket, setSocket] = useState<WebSocket | null>(null);
  let [seqNum, setSeqNum] = useState<number>(-1);
  
  useEffect(() => {
    function messageFunction(event: MessageEvent) {
      let parsedMessage: GameOutput = JSON.parse(event.data);

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
      let wsUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL}/wsConnection?playerIdToken=${playerIdToken}`;
  
      let newSocket = new WebSocket(wsUrl);
  
      newSocket.addEventListener("message", messageFunction);
      
      setSocket(newSocket);
    }, 3000);

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
      break;
    case "publicWaitingRoom":
      renderedGameState = <PublicWaitingRoomState />;
      break;
    case "privateWaitingRoomJoiner":
      renderedGameState = <PrivateWaitingRoomJoinerState socket={socket} seqNum={seqNum} gameStateData={gameStateData}/>;
      break;
    case "privateWaitingRoomCreator":
      renderedGameState = <PrivateWaitingRoomCreatorState socket={socket} seqNum={seqNum} gameStateData={gameStateData}/>;
      break;
    case "lobby":
      renderedGameState = <LobbyState gameStateData={gameStateData} />
      break;
    case "toss":
      renderedGameState = <TossState socket={socket} seqNum={seqNum} gameStateData={gameStateData}/>
      break;
    case "tossWinnerSelection":
      renderedGameState = <TossWinnerSelectionState socket={socket} seqNum={seqNum} gameStateData={gameStateData}/>
      break;
    case "innings1":
      renderedGameState = <Innings1State socket={socket} seqNum={seqNum} gameStateData={gameStateData} />
      break;
    case "inningsBreak":
      renderedGameState = <InningsBreakState gameStateData={gameStateData} />
      break;
    case "innings2":
      renderedGameState = <Innings2State socket={socket} seqNum={seqNum} gameStateData={gameStateData} />
      break;
    case "leave":
      renderedGameState = <LeaveState outputContainer={gameStateData} />
      break;
  }

  let gameHeader;
  if (gameState === "pendingConnection" || gameState === "leave") {
    gameHeader = <Header title="Game" />;
  } else {
    gameHeader = <GameHeader title="Game" socket={socket} state={gameState} seqNum={seqNum}/>
  }
  return ( 
    <>
      {gameHeader}
      {renderedGameState}
      <Footer />
    </>
  );
}
