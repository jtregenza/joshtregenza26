import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import Link from 'next/link';
import styles from './process.module.css';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function ProcessPage() {
  const processItems = await reader.collections.process.all();

  const phases = processItems.sort((a, b) => {
    const nA = a.entry.phaseNumber ?? 99;
    const nB = b.entry.phaseNumber ?? 99;
    return nA - nB;
  });

  return (
  <>
  </>
  );
}