'use client'

export function PublicWaitingRoomState() {
  
  return (
    <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center">
      <h1 className="font-bold text-center text-xl sm:text-2xl ls:text-lg">Searching for a game!</h1>
      <h2 className="loading font-bold text-xl sm:text-2xl ls:text-lg"></h2>
    </main>
  )
}
