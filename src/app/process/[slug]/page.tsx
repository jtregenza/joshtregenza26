import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import { MediaPlayer } from '../../../../components/VideoPlayer';

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateStaticParams() {
  const processItems = await reader.collections.process.all();
  return processItems.map((item) => ({
    slug: item.slug,
  }));
}

export default async function ProcessDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const item = await reader.collections.process.read(slug);
  
  if (!item) notFound();

  const { node } = await item.content();
  const errors = Markdoc.validate(node);
  
  if (errors.length) {
    console.error(errors);
    throw new Error('Invalid content');
  }
  
  const renderable = Markdoc.transform(node);

  // Prioritize video over audio
  const mediaUrl = item.videoUrl || item.audioUrl;

  return (
    <article style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      {mediaUrl ? (
        <div style={{ marginBottom: '2rem' }}>
          <MediaPlayer 
            mediaUrl={mediaUrl} 
            mediaPoster={item.featuredImage || undefined}
          />
        </div>
      ) : item.featuredImage ? (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', marginBottom: '2rem', borderRadius: '8px', overflow: 'hidden' }}>
          <Image
            src={item.featuredImage}
            alt={item.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      ) : null}

      <div style={{ marginBottom: '2rem' }}>
        <span style={{ 
          display: 'inline-block',
          padding: '0.5rem 1rem', 
          background: '#0070f3', 
          color: 'white', 
          borderRadius: '20px', 
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          {item.category}
        </span>
        <h1 style={{ margin: '0.5rem 0 1rem' }}>{item.title}</h1>
        <p style={{ fontSize: '1.25rem', color: '#666' }}>{item.description}</p>
      </div>

      <div style={{ lineHeight: '1.8', marginBottom: '2rem' }}>
        {Markdoc.renderers.react(renderable, React)}
      </div>

      {item.tags && item.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {item.tags.map((tag) => (
            <span 
              key={tag}
              style={{ padding: '0.5rem 1rem', background: '#f0f0f0', borderRadius: '20px', fontSize: '0.875rem' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}