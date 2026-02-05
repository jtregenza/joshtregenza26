import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './musings.module.css';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function MusingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const musings = await reader.collections.musings.all();
  
  const sortedProjects = musings.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className={styles.musingsContainer}>
      <aside className={styles.sidebar}>
        <h2>musings</h2>
        <nav className={styles.projectNav}>
          <Link href="/musings" className={styles.navLink}>
            All musings
          </Link>
          {sortedProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/musings/${project.slug}`}
              className={styles.navLink}
            >
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