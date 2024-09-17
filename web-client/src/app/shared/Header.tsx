import Link from "next/link";

export default function Header({ title }: { title: string } ){
  return (
    <header className="h-[10dvh] ls:h-[15dvh] pt-4 pl-4">
      <h1 className="white font-bold text-3xl sm:text-4xl ls:text-2xl">
        <Link className="pink hover:underline"href='/'>SP</Link> ||| { title }
      </h1>
    </header>
  );
}
