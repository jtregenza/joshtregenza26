import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './lab.module.css';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function MusingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const lab = await reader.collections.lab.all();
  
  const sortedProjects = lab.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className={styles.labContainer}>
      <aside className={styles.sidebar}>
        <h2>lab</h2>
        <nav className={styles.projectNav}>
          <Link href="/lab" className={styles.navLink}>
            All lab
          </Link>
          {sortedProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/lab/${project.slug}`}
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