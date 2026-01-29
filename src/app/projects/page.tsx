import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import Image from 'next/image';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function ProjectsPage() {
  const projects = await reader.collections.projects.all();
  
  const sortedProjects = projects.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div>
      <h1>All Projects</h1>
      <p>Explore my portfolio of work</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {sortedProjects.map((project) => (
          <Link 
            key={project.slug}
            href={`/projects/${project.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {project.entry.featuredImage && (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                <Image
                  src={project.entry.featuredImage}
                  alt={project.entry.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <h2 style={{ marginBottom: '0.5rem' }}>{project.entry.title}</h2>
            <p style={{ color: '#666' }}>{project.entry.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}