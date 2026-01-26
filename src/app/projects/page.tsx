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
    
      Projects
      
        {sortedProjects.map((project) => (
          
            {project.entry.featuredImage && (
              
                
              
            )}
            
              {project.entry.title}
            
            {project.entry.description}
          
        ))}
      
    
  );
}