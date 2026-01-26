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
    
      Musings
      
        {sortedMusings.map((musing) => (
          
            
              {musing.entry.featuredImage && (
                
                  
                
              )}
              
                
                  {musing.entry.title}
                
                {musing.entry.excerpt}
                {musing.entry.publishedDate && (
                  
                    {new Date(musing.entry.publishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  
                )}
              
            
          
        ))}
      
    
  );
}