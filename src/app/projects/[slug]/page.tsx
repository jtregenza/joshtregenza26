import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateStaticParams() {
  const projects = await reader.collections.projects.all();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ 
  params 
}: { 
  params: Promise 
}) {
  const { slug } = await params;
  const project = await reader.collections.projects.read(slug);
  
  if (!project) notFound();

  const { node } = await project.content();
  const errors = Markdoc.validate(node);
  
  if (errors.length) {
    console.error(errors);
    throw new Error('Invalid content');
  }
  
  const renderable = Markdoc.transform(node);

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

      
        {Markdoc.renderers.react(renderable, React)}
      

      {project.tags && project.tags.length > 0 && (
        
          {project.tags.map((tag) => (
            
              {tag}
            
          ))}
        
      )}
    
  );
}