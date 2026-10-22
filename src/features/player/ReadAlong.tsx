import { useEffect, useRef } from 'react';
import type { Recording } from '../../data/types';
import styles from './ReadAlong.module.css';
import { currentSentenceIndex, splitSentences } from './sentences';

export function ReadAlong({ recording }: { recording: Recording }) {
  const sentences = splitSentences(recording.text);
  const idx = currentSentenceIndex(recording.positionSec, recording.durationSec, sentences.length);
  const currentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  }, [idx]);

  return (
    <div className={styles.text}>
      {sentences.map((s, i) => (
        <p
          key={i}
          ref={i === idx ? currentRef : undefined}
          aria-current={i === idx ? 'true' : undefined}
          className={i === idx ? styles.current : i < idx ? styles.past : styles.future}
        >
          {s}
        </p>
      ))}
    </div>
  );
}
