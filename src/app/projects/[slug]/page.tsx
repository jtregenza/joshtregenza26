import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import dynamic from 'next/dynamic';
import styles from '../projects.module.css'

// const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateStaticParams() {
  const projects = await reader.collections.projects.all();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Helper function to detect if URL is YouTube or Vimeo
function getVideoEmbedUrl(url: string): { type: 'embed' | 'native'; embedUrl: string } | null {
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return { type: 'embed', embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return { type: 'embed', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}` };
  }

  // Direct video file
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return { type: 'native', embedUrl: url };
  }

  return null;
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

   const videoEmbed = project.videoUrl ? getVideoEmbedUrl(project.videoUrl) : null;

  return (
    <>
    <article className={styles.coreContent}>
      <h1>{project.title}</h1>
      <div>
        {Markdoc.renderers.react(renderable, React)}
      </div>

      {project.tags && project.tags.length > 0 && (
        <div className={styles.tags}>
            <p>File Under:</p>
          {project.tags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>

      <div className={styles.extraContent}>
  
        {project.liveUrl && (
          <a className={styles.contentLinks}
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View Site
          </a>
        )}
        {project.githubUrl && (
          <a className={styles.contentLinks}
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        )}





          {project.videoUrl && videoEmbed ? (
        <div className={styles.videoCore}>
          {videoEmbed.type === 'embed' ? (
            <iframe 
              src={videoEmbed.embedUrl}
              width="100%" 
              height="500"
              style={{ border: 'none', borderRadius: '8px' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video 
              controls 
              width="100%" 
              style={{ maxWidth: '100%', borderRadius: '8px' }}
            >
              <source src={videoEmbed.embedUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      ) : project.featuredImage ? (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', marginBottom: '2rem', borderRadius: '8px', overflow: 'hidden' }}>
          <Image
            src={project.featuredImage}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      ) : null}

      {project.audioUrl && (
        <div className={styles.audioCore}>
            <p>Listen below</p>
          <audio 
            controls 
            style={{ width: '100%' }}
          >
            <source src={project.audioUrl} type="audio/mpeg" />
            <source src={project.audioUrl} type="audio/ogg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}

    </div>

    </>
  );
}