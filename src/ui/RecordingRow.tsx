import type { HTMLAttributes } from 'react';
import { t, typeLabel } from '../content/ru';
import type { Recording } from '../data/types';
import { formatClock } from '../i18n/format';
import { statusOf } from '../store/library';
import { Icon } from './icons';
import styles from './RecordingRow.module.css';

interface Props {
  recording: Recording;
  index?: number;
  onPress(): void;
  onMore?(): void;
  pressProps?: HTMLAttributes<HTMLButtonElement>;
}

export function RecordingRow({ recording: r, index, onPress, onMore, pressProps }: Props) {
  const status = statusOf(r);
  const sub =
    status === 'generating'
      ? t.row.generating(Math.round((r.generationProgress ?? 0) * 100))
      : status === 'finished'
        ? t.row.finished
        : r.meta ?? typeLabel[r.type];

  return (
    <div className={styles.row} data-testid="recording-row">
      <button className={styles.main} onClick={onPress} {...pressProps}>
        {index !== undefined && <span className={styles.num}>{String(index).padStart(2, '0')}</span>}
        <span className={styles.text}>
          <span className={styles.title}>{r.title}</span>
          <span className={`${styles.sub} ${status === 'generating' ? styles.generating : ''}`}>
            {status === 'finished' && <Icon name="check" size={13} />}
            {sub}
          </span>
          {status === 'started' && (
            <span className={styles.progress} aria-hidden="true">
              <span style={{ width: `${(r.positionSec / r.durationSec) * 100}%` }} />
            </span>
          )}
        </span>
        <span className={styles.duration}>{formatClock(r.durationSec)}</span>
      </button>
      {onMore && (
        <button className={styles.more} aria-label={t.row.more} onClick={onMore}>
          <Icon name="more" size={20} />
        </button>
      )}
    </div>
  );
}
