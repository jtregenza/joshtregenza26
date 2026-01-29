import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './voice.module.css';
import PlayIcon from '../../../components/svgs/play-element';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function VoiceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const voice = await reader.collections.voice.all();
  
  const sortedvoice = voice.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className={styles.voiceContainer}>
      <aside className={styles.sidebar}>
        <h2>Voice Acting</h2>
        <p>These demos show what I do. Commercial work that doesn't insult your audience's intelligence. Characters that feel lived-in, not performed at. Narration that people might actually want to listen to. I've put in the work, learned the craft, and I show up ready to deliver.</p>
        <p>Listen to the reels. If it's what you're looking for, let's talk.</p>
        <nav className={styles.voiceNav}>
          <Link href="/voice" className={styles.navLink}>
            <PlayIcon/> All Voice Work
          </Link>
          {sortedvoice.map((project) => (
            <Link
              key={project.slug}
              href={`/voice/${project.slug}`}
              className={styles.navLink}
            >
                <PlayIcon/>
              {project.entry.title}
            </Link>
          ))}
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}