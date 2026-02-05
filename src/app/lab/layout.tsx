import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './lab.module.css';
import LabLayoutClient from './LabLayoutClient';

const reader = createReader(process.cwd(), keystaticConfig);

// Small icon component for sidebar
const SmallExperimentIcon = ({ index }: { index: number }) => {
  const patterns = [
    // Yarn ball
    <svg key="yarn" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="white"/>
      <path d="M10 16 Q16 10 22 16 Q16 22 10 16" stroke="#333" strokeWidth="1" fill="none"/>
      <path d="M16 10 Q22 16 16 22 Q10 16 16 10" stroke="#333" strokeWidth="1" fill="none"/>
    </svg>,
    // Dotted sphere
    <svg key="dotted" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="white"/>
      {[...Array(8)].map((_, i) => (
        <circle key={i} cx={16 + 10 * Math.cos(i * Math.PI / 4)} cy={16 + 10 * Math.sin(i * Math.PI / 4)} r="1.5" fill="#333"/>
      ))}
    </svg>,
    // Geometric shape
    <svg key="geo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="16" height="16" fill="white" stroke="#333" strokeWidth="1"/>
      <path d="M8 8 L24 24 M24 8 L8 24" stroke="#333" strokeWidth="0.5"/>
    </svg>,
    // Striped sphere
    <svg key="striped" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="white"/>
      {[...Array(5)].map((_, i) => (
        <line key={i} x1="16" y1={2 + i * 6} x2="16" y2={8 + i * 6} stroke="#333" strokeWidth="1"/>
      ))}
    </svg>,
    // Diamond
    <svg key="diamond" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4 L28 16 L16 28 L4 16 Z" fill="white" stroke="#333" strokeWidth="1"/>
    </svg>,
    // Mesh sphere
    <svg key="mesh" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="white" stroke="#333" strokeWidth="1"/>
      <ellipse cx="16" cy="16" rx="14" ry="7" fill="none" stroke="#333" strokeWidth="0.5"/>
      <ellipse cx="16" cy="16" rx="7" ry="14" fill="none" stroke="#333" strokeWidth="0.5"/>
    </svg>,
    // Wave
    <svg key="wave" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16 Q10 10 16 16 Q22 22 28 16" stroke="white" strokeWidth="2" fill="none"/>
    </svg>,
  ];
  
  return patterns[index % patterns.length];
};

export default async function LabLayout({
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

  const sidebar = (
    <aside className={styles.sidebar}>
      <h2>lab</h2>
      <nav className={styles.projectNav}>
        <Link href="/lab" className={styles.navLink}>
          All lab
        </Link>
        {sortedProjects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/lab/${project.slug}`}
            className={styles.navLink}
          >
            <span className={styles.navIcon}>
              <SmallExperimentIcon index={index} />
            </span>
            {project.entry.title}
          </Link>
        ))}
      </nav>
    </aside>
  );

  return (
    <LabLayoutClient sidebar={sidebar}>
      {children}
    </LabLayoutClient>
  );
}