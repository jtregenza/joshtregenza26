'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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

export default function ProcessTimeline({ items }: ProcessTimelineProps) {
  const pathname = usePathname();
  const isMainPage = pathname === '/process';
  const currentSlug = pathname.split('/').pop();

  return (
    <div className={isMainPage ? styles.timelineContainerMain : styles.timelineContainerCompact}>
      <div className={styles.timeline}>
        <div className={styles.timelineLine}></div>
        {items.map((item, index) => {
          const isActive = pathname.includes(item.slug);
          
          return (
            <Link
              key={item.slug}
              href={`/process/${item.slug}`}
              className={`${styles.timelineNode} ${isActive ? styles.timelineNodeActive : ''}`}
              style={{
                left: `${(index / (items.length - 1)) * 100}%`,
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