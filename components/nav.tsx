'use client'
import Link from "next/link";
import styles from './style/nav.module.css'
import Ticker from "./Ticker";



interface NavProps {
  cmsMessages: readonly string[]; // Changed from string[] to readonly string[]
}

export default function Nav({ cmsMessages }: NavProps) {
  return (
    <header className={styles.header}>
        <Link href="/">Home</Link>
        <Link href="/projects">Portfolio</Link>
        <Link href="/voice">Voice Acting</Link>
        <Link href="/lab">Lab</Link>
        <Link href="/musings">Musings</Link>
        <Link href="/process">Process</Link>
        <Link href="/contact">Contact</Link>
        <Ticker cmsMessages={cmsMessages}/>
    </header>
)
}