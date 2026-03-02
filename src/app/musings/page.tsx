import EyeMove from '../../../components/eyeMove';
import styles from './musings.module.css';

export default function MusingsPage() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateContent}>
        <div className={styles.eyeWrapper}>
          <EyeMove size="5rem"/>
        </div>
        <h2>Select a musing</h2>
        <p>Choose a musing from the feed to read the full post</p>
      </div>
    </div>
  );
}