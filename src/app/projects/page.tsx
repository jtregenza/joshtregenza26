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
      <h1>Projects</h1>
      <div>
        {sortedProjects.map((project) => (
          <Link 
            key={project.slug}
            href={`/projects/${project.slug}`}
          >
            {project.entry.featuredImage && (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                <Image
                  src={project.entry.featuredImage}
                  alt={project.entry.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <h2>{project.entry.title}</h2>
            <p>{project.entry.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}