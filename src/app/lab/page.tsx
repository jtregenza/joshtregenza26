import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import styles from './lab.module.css';
import WelcomeText from '../../../components/welcome/WelcomeText.server';



const reader = createReader(process.cwd(), keystaticConfig);

// Icon component
const ExperimentIcon = ({ type, index }: { type: string; index: number }) => {
  const patternIndex = index % 8;
  
  switch (patternIndex) {
    case 0:
      // Yarn ball pattern
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="white"/>
          <path d="M20 32 Q32 20 44 32 Q32 44 20 32" stroke="#333" strokeWidth="2" fill="none"/>
          <path d="M32 20 Q44 32 32 44 Q20 32 32 20" stroke="#333" strokeWidth="2" fill="none"/>
          <circle cx="32" cy="32" r="4" fill="#333"/>
        </svg>
      );
    case 1:
      // Dotted sphere
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="white"/>
          {[...Array(16)].map((_, i) => (
            <circle key={i} cx={32 + 20 * Math.cos(i * Math.PI / 8)} cy={32 + 20 * Math.sin(i * Math.PI / 8)} r="2" fill="#333"/>
          ))}
        </svg>
      );
    case 2:
      // Geometric crossed square
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="14" y="14" width="36" height="36" fill="white" stroke="#333" strokeWidth="2"/>
          <path d="M14 14 L50 50 M50 14 L14 50" stroke="#333" strokeWidth="2"/>
          <rect x="28" y="28" width="8" height="8" fill="#333"/>
        </svg>
      );
    case 3:
      // Striped sphere
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="white" stroke="#333" strokeWidth="2"/>
          {[...Array(7)].map((_, i) => (
            <line key={i} x1={4 + i * 8} y1="4" x2={4 + i * 8} y2="60" stroke="#333" strokeWidth="1.5"/>
          ))}
        </svg>
      );
    case 4:
      // Diamond/star
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 4 L40 28 L64 32 L40 36 L32 60 L24 36 L0 32 L24 28 Z" fill="white" stroke="#333" strokeWidth="2"/>
        </svg>
      );
    case 5:
      // Mesh/grid sphere
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="white" stroke="#333" strokeWidth="2"/>
          <ellipse cx="32" cy="32" rx="28" ry="14" fill="none" stroke="#333" strokeWidth="1"/>
          <ellipse cx="32" cy="32" rx="14" ry="28" fill="none" stroke="#333" strokeWidth="1"/>
          <line x1="4" y1="32" x2="60" y2="32" stroke="#333" strokeWidth="1"/>
        </svg>
      );
    case 6:
      // Wavy/curved
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="white" stroke="#333" strokeWidth="2"/>
          <path d="M8 32 Q20 20 32 32 Q44 44 56 32" stroke="#333" strokeWidth="2" fill="none"/>
          <path d="M32 8 Q44 20 32 32 Q20 44 32 56" stroke="#333" strokeWidth="2" fill="none"/>
        </svg>
      );
    case 7:
    default:
      // Clover/propeller
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="6" fill="white" stroke="#333" strokeWidth="2"/>
          <circle cx="32" cy="12" r="10" fill="white" stroke="#333" strokeWidth="2"/>
          <circle cx="52" cy="32" r="10" fill="white" stroke="#333" strokeWidth="2"/>
          <circle cx="32" cy="52" r="10" fill="white" stroke="#333" strokeWidth="2"/>
          <circle cx="12" cy="32" r="10" fill="white" stroke="#333" strokeWidth="2"/>
        </svg>
      );
  }
};

export default async function LabPage() {
  const lab = await reader.collections.lab.all();
  
  const sortedLab = lab.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  // Split experiments between left and right diagonals
  const halfPoint = Math.ceil(sortedLab.length / 2);
  const leftExperiments = sortedLab.slice(0, halfPoint);
  const rightExperiments = sortedLab.slice(halfPoint);

  return (
    <div className={styles.labLanding}>
      <div className={styles.diagonalContainer}>
        {/* Left dark diagonal section */}
        <div className={styles.leftDiagonal}></div>
        
        {/* Right teal/green diagonal section */}
        <div className={styles.rightDiagonal}></div>
        
        {/* White center V */}
        <div className={styles.centerV}></div>
        
        {/* Icons positioned along the diagonals */}
        <div className={styles.iconsContainer}>
          {/* Left diagonal icons */}
          {leftExperiments.map((item, index) => {
            // Position icons along left diagonal (top-left to center-bottom)
            const percentage = (index / (leftExperiments.length - 1 || 1)) * 100;
            const top = `${percentage}%`;
            const left = `${percentage / 2}%`;
            
            return (
              <Link
                key={item.slug}
                href={`/lab/${item.slug}`}
                className={styles.experimentIcon}
                data-title={item.entry.title}
                style={{ top, left }}
              >
                <ExperimentIcon type={item.entry.status || 'default'} index={index} />
              </Link>
            );
          })}
          
          {/* Right diagonal icons */}
          {rightExperiments.map((item, index) => {
            // Position icons along right diagonal (top-right to center-bottom)
            const percentage = (index / (rightExperiments.length - 1 || 1)) * 100;
            const top = `${percentage}%`;
            const right = `${percentage / 2}%`;
            
            return (
              <Link
                key={item.slug}
                href={`/lab/${item.slug}`}
                className={styles.experimentIcon}
                data-title={item.entry.title}
                style={{ top, right }}
              >
                <ExperimentIcon 
                  type={item.entry.status || 'default'} 
                  index={index + leftExperiments.length} 
                />
              </Link>
            );
          })}
        </div>
        
        {/* Welcome text with glitch and cycling */}
        <WelcomeText/>
      </div>
    </div>
  );
}