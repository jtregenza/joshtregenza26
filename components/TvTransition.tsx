'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './style/PageTransition.module.css';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Start transition
    setIsTransitioning(true);

    // After transition effect completes, update content
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 800); // Adjust timing to match CSS animation

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <>
      {/* TV Static Overlay */}
      <div className={`${styles.tvOverlay} ${isTransitioning ? styles.tvOverlayActive : ''}`}>
        <div className={styles.tvStatic}></div>
        <div className={styles.tvScanlines}></div>
        <div className={styles.tvVignette}></div>
      </div>

      {/* Page Content */}
      <div className={`${styles.pageContent} ${isTransitioning ? styles.pageContentTransition : ''}`}>
        {displayChildren}
      </div>
    </>
  );
}