import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './projects.module.css';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function ProjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const projects = await reader.collections.projects.all();
  
  const sortedProjects = projects.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className={styles.projectsContainer}>
      <aside className={styles.sidebar}>
        <h2>Projects</h2>
        <nav className={styles.projectNav}>
          <Link href="/projects" className={styles.navLink}>
            All Projects
          </Link>
          {sortedProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
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