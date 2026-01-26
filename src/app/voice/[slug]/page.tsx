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
  const voice = await reader.collections.voice.all();
  return voice.map((item) => ({
    slug: item.slug,
  }));
}

export default async function VoiceDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const item = await reader.collections.voice.read(slug);
  
  if (!item) notFound();

  const { node } = await item.content();
  const errors = Markdoc.validate(node);
  
  if (errors.length) {
    console.error(errors);
    throw new Error('Invalid content');
  }
  
  const renderable = Markdoc.transform(node);

  return (
    <article>
      {item.featuredImage && (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
          <Image
            src={item.featuredImage}
            alt={item.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      <h1>{item.title}</h1>
      
      {item.role && <p><strong>Role:</strong> {item.role}</p>}
      {item.client && <p><strong>Client:</strong> {item.client}</p>}
      
      <p>{item.description}</p>

      {item.audioUrl && (
        <div>
          <h3>Demo Reel / Audio</h3>
          {/* <ReactPlayer 
            url={item.audioUrl || ''} 
            controls 
            width="100%"
            height="80px"
          /> */}
        </div>
      )}

      {item.videoUrl && (
        <div>
          <h3>Video</h3>
          {/* <ReactPlayer 
            url={item.videoUrl || ''} 
            controls 
            width="100%"
            height="500px"
          /> */}
        </div>
      )}

      <div>
        {Markdoc.renderers.react(renderable, React)}
      </div>

      {item.tags && item.tags.length > 0 && (
        <div>
          {item.tags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}