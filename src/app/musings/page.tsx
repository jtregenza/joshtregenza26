import styles from './musings.module.css';

export default function MusingsPage() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateContent}>
        <h2>Select a musing</h2>
        <p>Choose a musing from the feed to read the full post</p>
      </div>
    </div>
  );
}