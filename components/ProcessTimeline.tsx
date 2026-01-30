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
  
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      {isMainPage && (
        <div className={styles.categorySelector}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`${styles.categoryButton} ${selectedCategory === cat.value ? styles.categoryButtonActive : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Compact category indicator on detail pages */}
      {!isMainPage && currentItem && (
        <div className={styles.categoryIndicator}>
          <span className={styles.categoryBadge}>
            {CATEGORIES.find(c => c.value === currentItem.category)?.label || currentItem.category}
          </span>
        </div>
      )}

      <div className={styles.timeline}>
        <div className={styles.timelineLine}></div>
        {filteredItems.map((item, index) => {
          const isActive = pathname.includes(item.slug);
          
          return (
            <Link
              key={item.slug}
              href={`/process/${item.slug}`}
              className={`${styles.timelineNode} ${isActive ? styles.timelineNodeActive : ''}`}
              style={{
                left: `${(index / Math.max(filteredItems.length - 1, 1)) * 100}%`,
              }}
            >
              <div className={styles.nodeCircle}>
                <span className={styles.nodeNumber}>{index + 1}</span>
              </div>
              {isMainPage && (
                <div className={styles.nodeLabel}>
                  <h3>{item.title}</h3>
                  <span className={styles.nodeCategory}>{item.category}</span>
                </div>
              )}
              {!isMainPage && isActive && (
                <div className={styles.nodeTooltip}>
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}