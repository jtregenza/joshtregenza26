import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Markdoc from '@markdoc/markdoc';
import React from 'react';

import styles from '../lab.module.css';

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateStaticParams() {
  const lab = await reader.collections.lab.all();
  return lab.map((item) => ({
    slug: item.slug,
  }));
}

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

export default async function LabDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const item = await reader.collections.lab.read(slug);
  
  if (!item) notFound();

  const { node } = await item.content();
  const errors = Markdoc.validate(node);
  
  if (errors.length) {
    console.error(errors);
    throw new Error('Invalid content');
  }
  
  const renderable = Markdoc.transform(node);

  // Prioritize video over audio over image
  const mediaUrl = item.videoUrl || item.audioUrl;
  const videoEmbed = item.videoUrl ? getVideoEmbedUrl(item.videoUrl) : null;

  return (
    <article className={styles.labDetail}>
      <div className={styles.labHeader}>
        <div className={styles.statusBadge} data-status={item.status}>
          {item.status}
        </div>
        <h1 className={styles.labTitle}>{item.title}</h1>
        <p className={styles.labDescription}>{item.description}</p>
      </div>

      {/* Media Section */}
      {mediaUrl ? (
        <div className={styles.labMedia}>
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
      ) : item.featuredImage ? (
        <div className={styles.labMedia}>
          <Image
            src={item.featuredImage}
            alt={item.title}
            width={1200}
            height={675}
            className={styles.labImage}
          />
        </div>
      ) : null}

      {/* External Link */}
      {item.externalUrl && (
        <div className={styles.externalLink}>
          <a 
            href={item.externalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.externalButton}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View Live Project
          </a>
        </div>
      )}

      {/* Content */}
      <div className={styles.labContent}>
        {Markdoc.renderers.react(renderable, React)}
      </div>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className={styles.labTags}>
          <h3>Tags</h3>
          <div className={styles.tagList}>
            {item.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}