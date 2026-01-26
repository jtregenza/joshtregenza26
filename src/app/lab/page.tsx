import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import Image from 'next/image';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function LabPage() {
  const lab = await reader.collections.lab.all();
  
  const sortedLab = lab.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div>
      <h1>Lab</h1>
      <p>Experiments, prototypes, and creative explorations</p>
      <div>
        {sortedLab.map((item) => (
          <Link 
            key={item.slug}
            href={`/lab/${item.slug}`}
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
            <p><strong>Status:</strong> {item.entry.status}</p>
            <p>{item.entry.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}