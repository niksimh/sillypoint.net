'use client';

import Footer from "@/shared/Footer";
import Header from "@/shared/Header";
import PendingState from "./gameStates/pending";

import { useState } from "react";

export default function GamePage() {
  
  let [gameState, setGameState] = useState("pendingConnection");
  
  let renderedGameState;
  switch(gameState) {
    case "pendingConnection": 
      renderedGameState = <PendingState />
      break;
  }

  return (
    <>
      <Header title="Game"/>
      {renderedGameState}
      <Footer />
    </>
  );
}
