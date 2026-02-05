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
  const musings = await reader.collections.musings.all();
  return musings.map((musing) => ({
    slug: musing.slug,
  }));
}

export default async function MusingPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const musing = await reader.collections.musings.read(slug);
  
  if (!musing) notFound();

  const { node } = await musing.content();
  const errors = Markdoc.validate(node);
  
  if (errors.length) {
    console.error(errors);
    throw new Error('Invalid content');
  }
  
  const renderable = Markdoc.transform(node);

  return (
    <article>
      {musing.featuredImage && (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
          <Image
            src={musing.featuredImage}
            alt={musing.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      <h1>{musing.title}</h1>
      
      {musing.date && (
        <time>
          {new Date(musing.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      )}

      {musing.audioUrl && (
        <div>
          <p>Listen to this musing:</p>
          
        </div>
      )}

      <div>
        {Markdoc.renderers.react(renderable, React)}
      </div>

      {musing.tags && musing.tags.length > 0 && (
        <div>
          {musing.tags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}