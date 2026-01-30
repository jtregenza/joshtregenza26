import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import Image from 'next/image';
import styles from './projects.module.css'

const reader = createReader(process.cwd(), keystaticConfig);

export default async function ProjectsPage() {
  const projects = await reader.collections.projects.all();
  
  const sortedProjects = projects.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div style={{width: '100%'}}>
      <h1>All Projects</h1>
      <p>Explore my portfolio of work</p>
      <div className={styles.cardContainer}>
        {sortedProjects.map((project) => (
          <Link 
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={styles.projectCard}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {project.entry.featuredImage && (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden' }}>
                <Image
                  src={project.entry.featuredImage}
                  alt={project.entry.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <div className={styles.cardContent}>
                <h2 style={{ marginBottom: '0.5rem' }}>{project.entry.title}</h2>
                <button>↰</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}