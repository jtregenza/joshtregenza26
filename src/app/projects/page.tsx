import { reader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';
import Link from 'next/link';
import Image from 'next/image';

export default async function ProjectsPage() {
  const projects = await reader(keystaticConfig).collections.projects.all();
  
  // Sort by date
  const sortedProjects = projects.sort((a, b) => 
    new Date(b.entry.date).getTime() - new Date(a.entry.date).getTime()
  );

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