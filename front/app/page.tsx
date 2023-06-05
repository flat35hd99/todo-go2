import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>
        <p>main page</p>
        <Link href="/todo">todo</Link>
      </div>
    </main>
  );
}
