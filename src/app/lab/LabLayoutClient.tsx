'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import styles from './lab.module.css';

export default function LabLayoutClient({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isLabHome = pathname === '/lab';

  if (isLabHome) {
    return <>{children}</>;
  }

  return (
    <div className={styles.labContainer}>
      {sidebar}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}