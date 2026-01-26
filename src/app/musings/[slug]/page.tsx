import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

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
  params: Promise 
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
    
      {musing.featuredImage && (
        
          
        
      )}

      {musing.title}
      
      {musing.publishedDate && (
        
          {new Date(musing.publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        
      )}

      {musing.audioUrl && (
        
          Listen to this musing:
          
        
      )}

      
        {Markdoc.renderers.react(renderable, React)}
      

      {musing.tags && musing.tags.length > 0 && (
        
          {musing.tags.map((tag) => (
            
              {tag}
            
          ))}
        
      )}
    
  );
}