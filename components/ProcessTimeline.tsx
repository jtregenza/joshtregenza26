'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import styles from './style/ProcessTimeline.module.css';

interface ProcessItem {
  slug: string;
  title: string;
  category: string;
  date: string | null;
}

interface ProcessTimelineProps {
  items: ProcessItem[];
}

const CATEGORIES = [
  { value: 'design', label: 'Design/Development' },
  { value: 'management', label: 'Management' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'voice-acting', label: 'Voice Acting' },
];

export default function ProcessTimeline({ items }: ProcessTimelineProps) {
  const pathname = usePathname();
  const isMainPage = pathname === '/process';
  const currentSlug = pathname.split('/').pop();
  
  const [selectedCategory, setSelectedCategory] = useState('design');

  // Get categories that have processes
  const availableCategories = useMemo(() => {
    const categoriesWithItems = new Set(items.map(item => item.category));
    return CATEGORIES.filter(cat => categoriesWithItems.has(cat.value));
  }, [items]);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);

  // If on a detail page, show category of current item
  const currentItem = items.find(item => item.slug === currentSlug);
  const activeCategory = isMainPage ? selectedCategory : currentItem?.category || 'all';

  return (
    <div className={isMainPage ? styles.timelineContainerMain : styles.timelineContainerCompact}>
      {/* Category Selector */}
      {isMainPage && availableCategories.length > 0 && (
        <>
          <h1>Select the Process Type</h1>
          <div className={styles.categorySelector}>
            {availableCategories.map(cat => (
              <button
                key={cat.value}
                className={`${styles.categoryButton} ${selectedCategory === cat.value ? styles.categoryButtonActive : ''}`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Compact category indicator on detail pages */}
      {!isMainPage && currentItem && (
        <Link 
          className={styles.backProcess}
          href="/process"
        >
          ← Back
        </Link>
      )}

      <div className={styles.timeline}>
        {filteredItems.map((item, index) => {
          const isActive = pathname.includes(item.slug);
          
          return (
            <Link
              key={item.slug}
              href={`/process/${item.slug}`}
              className={`${styles.timelineNode} ${isActive ? styles.timelineNodeActive : ''}`}
            >
              <span className={styles.nodeNumber}>{index + 1}</span> 
              <span className={styles.nodeLabel}>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}