import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import dynamic from 'next/dynamic';
import { MediaPlayer } from '../../../../components/VideoPlayer';
import styles from '../voice.module.css'

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
  
    // Prioritize video over audio, use whichever exists
  const mediaUrl = item.videoUrl || item.audioUrl;

  return (
    <article>
    <div className={styles.mediaWrapper}>
      {mediaUrl ? (
        <div>
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
      </div>
    </article>
  );
}