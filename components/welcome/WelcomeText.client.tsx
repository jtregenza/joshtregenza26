'use client';

import { useEffect, useState } from 'react';
import styles from './welcome.module.css';

type Props = {
  supervisorLabel: string;
  messages: readonly string[];
};

export default function WelcomeTextClient({
  supervisorLabel,
  messages,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(messageInterval);
  }, [messages.length]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(
          () => setIsGlitching(false),
          100 + Math.random() * 200
        );
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className={styles.welcomeText}>
      <span className={styles.staticText}>
        {supervisorLabel}
      </span>{' '}
      <span
        className={`${styles.cyclingText} ${
          isGlitching ? styles.glitch : ''
        }`}
        data-text={`<${messages[currentIndex]}>`}
      >
        &lt;{messages[currentIndex]}&gt;
      </span>
    </div>
  );
}
