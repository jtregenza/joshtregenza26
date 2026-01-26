import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import dynamic from 'next/dynamic';

// const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

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
  params: Promise<{ slug: string }> 
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
    <article>
      {project.featuredImage && (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
          <Image
            src={project.featuredImage}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      <h1>{project.title}</h1>
      <p>{project.description}</p>

      <div>
        {project.liveUrl && (
          <a 
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View Live
          </a>
        )}
        {project.githubUrl && (
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        )}
      </div>

      {project.videoUrl && (
        <div>
            Video
        </div>
      )}

      {project.audioUrl && (
        <div>
            Hello
        </div>
      )}

      <div>
        {Markdoc.renderers.react(renderable, React)}
      </div>

      {project.tags && project.tags.length > 0 && (
        <div>
          {project.tags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}