import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import Image from 'next/image';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function VoicePage() {
  const voice = await reader.collections.voice.all();
  
  const sortedVoice = voice.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div>
      <h1>Voice Work</h1>
      <div>
        {sortedVoice.map((item) => (
          <Link 
            key={item.slug}
            href={`/voice/${item.slug}`}
          >
            {item.entry.featuredImage && (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                <Image
                  src={item.entry.featuredImage}
                  alt={item.entry.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <h2>{item.entry.title}</h2>
            {item.entry.role && <p><strong>{item.entry.role}</strong></p>}
            {item.entry.client && <p>{item.entry.client}</p>}
            <p>{item.entry.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}