import { reader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReactPlayer from 'react-player';

export async function generateStaticParams() {
  const projects = await reader(keystaticConfig).collections.projects.all();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const project = await reader(keystaticConfig).collections.projects.read(params.slug);
  
  if (!project) notFound();

  const content = await project.content();

  return (
    
      {project.featuredImage && (
        
          
        
      )}

      {project.title}
      {project.description}

      
        {project.liveUrl && (
          
            View Live
          
        )}
        {project.githubUrl && (
          
            GitHub
          
        )}
      

      {project.videoUrl && (
        
          
        
      )}

      {project.audioUrl && (
        
          
        
      )}

      
        {content}
      

      {project.tags && project.tags.length > 0 && (
        
          {project.tags.map((tag) => (
            
              {tag}
            
          ))}
        
      )}
    
  );
}