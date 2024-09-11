'use client'

import { GameInput } from "@/types/io-types";

export function PublicWaitingRoomState() {
  
  return (
    <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center px-12">
      <h1 className="font-bold text-xl sm:text-2xl ls:text-lg">Searching for a game!</h1>
      <h2 className="loading font-bold text-xl sm:text-2xl ls:text-lg"></h2>
    </main>
  )
}
