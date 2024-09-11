import Link from "next/link";

export default function GameHeader(
  { title, socket, state, seqNum }: { title: string, socket: WebSocket | null, state: string, seqNum: number } ){
  
  function leaveHandler(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    let leaveButton = (document.getElementById("leave") as HTMLButtonElement);

    if(leaveButton.disabled) {
      return;
    }

    //Disable button
    leaveButton.disabled = true;

    //Send output
    let input = {
      seqNum: seqNum,
      inputContainer: {
        type: state+"Leave",
        input: "deliberate" 
      }
    }
    socket?.send(JSON.stringify(input));
  }

  return (
    <header className="h-[10dvh] ls:h-[15dvh] pt-4 pl-4 pr-4 flex justify-between">
      <h1 className="white font-bold text-3xl sm:text-4xl ls:text-2xl">
        <Link className="pink hover:underline"href='/'>SP</Link> ||| { title }
      </h1>
      <button id="leave" className="button h-[5dvh] ls:h-[7.5dvh] w-20 sm:w-24" onClick={leaveHandler}>
        <span className="white hover:underline font-bold text-md sm:text-lg ls:text-sm">Leave</span>
      </button>
    </header>
  );
}
