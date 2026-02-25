import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
// import { MediaPlayer } from 'components/MediaPlayer';
import styles from '../musings.module.css';

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

  const date = musing.date ? new Date(musing.date) : null;

  return (
    <article className={styles.tweetDetail}>
      {/* Tweet Header */}
      <div className={styles.tweetDetailHeader}>
        <div className={styles.avatar}>
          <span>JT</span>
        </div>
        <div className={styles.tweetDetailMeta}>
          <div className={styles.username}>Josh Tregenza</div>
          <div className={styles.handle}>@joshtregenza</div>
        </div>
      </div>

      {/* Tweet Content */}
      <div className={styles.tweetDetailContent}>
        <h1>{musing.title}</h1>

        {/* Media */}
        {musing.audioUrl ? (
          <></>
          // <div className={styles.tweetMedia}>
          //   <MediaPlayer 
          //     mediaUrl={musing.audioUrl} 
          //     mediaPoster={musing.featuredImage || undefined}
          //   />
          // </div>
        ) : musing.featuredImage ? (
          <div className={styles.tweetMedia}>
            <Image
              src={musing.featuredImage}
              alt={musing.title}
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto', borderRadius: '16px' }}
            />
          </div>
        ) : null}

        {/* Main Content */}
        <div className={styles.tweetBody}>
          {Markdoc.renderers.react(renderable, React)}
        </div>

        {/* Timestamp */}
        {date && (
          <div className={styles.tweetTimestamp}>
            {date.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
            {' · '}
            {date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        )}

        {/* Tags */}
        {musing.tags && musing.tags.length > 0 && (
          <div className={styles.tweetDetailTags}>
            {musing.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tweet Actions (Optional - for aesthetics) */}
      <div className={styles.tweetActions}>
        <button className={styles.actionButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </button>
        <button className={styles.actionButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 1l4 4-4 4"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <path d="M7 23l-4-4 4-4"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
        </button>
        <button className={styles.actionButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button className={styles.actionButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </button>
      </div>
    </article>
  );
}