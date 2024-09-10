import Link from "next/link";

export default function Header({ title }: { title: string } ){
  return (
    <header>
      <h1>
        <Link href='/'>SP</Link> ||| { title }</h1>
    </header>
  );
}
