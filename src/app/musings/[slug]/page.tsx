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
              style={{ width: '100%', borderRadius: '16px', objectFit: 'cover'}}
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


    </article>
  );
}