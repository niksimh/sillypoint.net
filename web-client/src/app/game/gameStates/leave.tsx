export function LeaveState({ outputContainer }: { outputContainer: any } ) {
  let msg;
  switch(outputContainer.subType) {
    case "deliberate":
      msg = "You have successfully left the game."
      break;
    case "timeout":
      msg = "You have timed out."
      break;
    case "gameOver":
      msg = outputContainer.data.winningStatement;
      break;
  }

  function selectionClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    window.location.reload();
  }

  return (
    <main className="h-[80dvh] ls:h-[75dvh] flex flex-col justify-center items-center gap-10 ls:gap-5 px-12">
      <h1 className="font-bold text-center text-xl sm:text-2xl ls:text-lg">{msg}</h1>
      <button 
        id="publicWaitingRoom" 
        onClick={selectionClick}
        className="button font-bold h-12 w-44 sm:w-52 ls:w-40 ls:text-sm"
        >
          Play!
        </button>
    </main>
  );
}