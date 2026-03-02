import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import { MediaPlayer } from '../../../../components/VideoPlayer';
import styles from './processDetail.module.css';

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateStaticParams() {
  const items = await reader.collections.process.all();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await reader.collections.process.read(slug);
  if (!item) return {};
  return {
    title: `${item.title} — Process`,
    description: item.description ?? undefined,
  };
}

export default async function ProcessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await reader.collections.process.read(slug);

  if (!item) notFound();

  // Render markdoc content
  const { node } = await item.content();
  const errors = Markdoc.validate(node);
  if (errors.length) {
    console.error(errors);
    throw new Error('Invalid markdoc content');
  }
  const renderable = Markdoc.transform(node);
  const hasContent = node.children.length > 0;

  const mediaUrl  = item.videoUrl || item.audioUrl || null;
  const num       = String(item.phaseNumber ?? '').padStart(2, '0');
  const accent    = item.accentColor ?? 'dark';

  return (
    <main className={[styles.page, styles[`accent--${accent}`]].join(' ')}>

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <span className={styles.watermark} aria-hidden="true">{num}</span>

        <div className={styles.heroContent}>
          <p className={styles.phaseLabel}>Phase {num}</p>
          <h1 className={styles.title}>{item.title}</h1>

          {item.tagline && (
            <blockquote className={styles.pullQuote}>
              {item.tagline}
            </blockquote>
          )}

          {item.description && (
            <p className={styles.description}>{item.description}</p>
          )}

          {item.category && (
            <span className={styles.categoryBadge}>{item.category}</span>
          )}
        </div>
      </header>

      {/* ── Media ── */}
      {mediaUrl ? (
        <div className={styles.mediaWrap}>
          <MediaPlayer
            mediaUrl={mediaUrl}
            mediaPoster={item.featuredImage ?? undefined}
          />
        </div>
      ) : item.featuredImage ? (
        <div className={styles.imageWrap}>
          <Image
            src={item.featuredImage}
            alt={item.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      ) : null}

      {/* ── Methods pills ── */}
      {item.methods && item.methods.length > 0 && (
        <section className={styles.methodsSection}>
          <p className={styles.methodsHeading}>Methods</p>
          <ul className={styles.methods}>
            {item.methods.map((method) => (
              <li key={method} className={styles.method}>{method}</li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Markdoc body ── */}
      {hasContent && (
        <div className={styles.body}>
          {Markdoc.renderers.react(renderable, React)}
        </div>
      )}

      {/* ── Tags ── */}
      {item.tags && item.tags.length > 0 && (
        <footer className={styles.tagsRow}>
          {item.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </footer>
      )}

      {/* ── Phase nav ── */}
      <div className={styles.phaseNav}>
        <Link href="/process" className={styles.phaseNavLink}>
          ← Back to Process
        </Link>
      </div>
    </main>
  );
}