import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import Image from 'next/image';
import styles from './projects.module.css'
import SymbolIcon from '../../../components/svgs/symbol';

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
      <div className={styles.cardContainer}>
        {sortedProjects.map((project) => (
          <Link 
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={styles.projectCard}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {project.entry.featuredImage && (
              <div className={styles.cardImage} style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={project.entry.featuredImage}
                  alt={project.entry.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <div className={styles.cardContent}>
                <h2>{project.entry.title}</h2>
                <div className={styles.cardIcon}><SymbolIcon/></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}