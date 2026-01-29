import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import styles from './process.module.css';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function ProcessPage() {
  const processItems = await reader.collections.process.all();
  
  const sortedProcess = processItems.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateA - dateB;
  });

  return (
    <div className={styles.processPage}>
      {/* <div className={styles.intro}>
        <h1>My Process</h1>
        <p>Follow my creative journey through these key stages</p>
      </div>
      
      <div className={styles.grid}>
        {sortedProcess.map((item, index) => (
          <div key={item.slug} className={styles.card}>
            <span className={styles.stepNumber}>Step {index + 1}</span>
            <h2>{item.entry.title}</h2>
            <span className={styles.category}>{item.entry.category}</span>
            <p>{item.entry.description}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
}