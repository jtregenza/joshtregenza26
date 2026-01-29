import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import { ReactNode } from 'react';
import ProcessTimeline from '../../../components/ProcessTimeline';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function ProcessLayout({
  children,
}: {
  children: ReactNode;
}) {
  const processItems = await reader.collections.process.all();
  
  const sortedProcess = processItems.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateA - dateB; // Oldest first for timeline
  });

  // Extract only the plain data (no functions) to pass to client component
  const timelineData = sortedProcess.map(item => ({
    slug: item.slug,
    title: item.entry.title,
    category: item.entry.category,
    date: item.entry.date,
  }));

  return (
    <div>
      <ProcessTimeline items={timelineData} />
      {children}
    </div>
  );
}