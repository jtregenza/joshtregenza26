import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import Image from 'next/image';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function MusingsPage() {
  const musings = await reader.collections.musings.all();
  
  const sortedMusings = musings.sort((a, b) => {
    const dateA = a.entry.publishedDate ? new Date(a.entry.publishedDate).getTime() : 0;
    const dateB = b.entry.publishedDate ? new Date(b.entry.publishedDate).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div>
      <h1>Musings</h1>
      <div>
        {sortedMusings.map((musing) => (
          <Link 
            key={musing.slug}
            href={`/musings/${musing.slug}`}
          >
            <article>
              {musing.entry.featuredImage && (
                <div style={{ position: 'relative', width: '200px', height: '130px' }}>
                  <Image
                    src={musing.entry.featuredImage}
                    alt={musing.entry.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div>
                <h2>{musing.entry.title}</h2>
                <p>{musing.entry.excerpt}</p>
                {musing.entry.publishedDate && (
                  <time>
                    {new Date(musing.entry.publishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}