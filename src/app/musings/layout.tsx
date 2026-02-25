import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './musings.module.css';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function MusingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const musings = await reader.collections.musings.all();
  
  const sortedMusings = musings.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className={styles.twitterContainer}>
      {/* Left Panel - Twitter Feed Style */}
      <aside className={styles.feedPanel}>
        <div className={styles.feedHeader}>
          <h2>Musings</h2>
        </div>
        
        <div className={styles.tweetFeed}>
          {sortedMusings.map((musing) => {
            const date = musing.entry.date 
              ? new Date(musing.entry.date)
              : null;
            
            return (
              <Link
                key={musing.slug}
                href={`/musings/${musing.slug}`}
                className={styles.tweetCard}
              >
                <div className={styles.tweetHeader}>
                  <div className={styles.avatar}>
                    <span>JT</span>
                  </div>
                  <div className={styles.tweetMeta}>
                    <span className={styles.username}>Josh Tregenza</span>
                    <span className={styles.handle}>@joshtregenza</span>
                    {date && (
                      <>
                        <span className={styles.dot}>·</span>
                        <span className={styles.date}>
                          {formatTwitterDate(date)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className={styles.tweetContent}>
                  <h3>{musing.entry.title}</h3>
                  <p>{musing.entry.excerpt}</p>
                </div>

                {musing.entry.tags && musing.entry.tags.length > 0 && (
                  <div className={styles.tweetTags}>
                    {musing.entry.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className={styles.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Right Panel - Tweet Detail Style */}
      <main className={styles.detailPanel}>
        {children}
      </main>
    </div>
  );
}

function formatTwitterDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}