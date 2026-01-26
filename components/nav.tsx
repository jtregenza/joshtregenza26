import Link from "next/link";

export default function Nav() {
  return (
    <header>
        <Link href="/">Home</Link>
        <Link href="/projects">Portfolio</Link>
        <Link href="/voice">Voice Acting</Link>
        <Link href="/lab">Lab</Link>
        <Link href="/musings">Musings</Link>
        <Link href="/process">Process</Link>
        <Link href="/contact">Contact</Link>
    </header>
)
}