import { t } from '../../content/ru';
import type { Recording } from '../../data/types';
import { formatClock } from '../../i18n/format';
import { usePlayer } from '../../store/player';
import { Sheet } from '../../ui/Sheet';
import { currentChapterIndex } from './sentences';
import styles from './sheets.module.css';

export function ChaptersSheet({ open, onClose, recording }: { open: boolean; onClose(): void; recording: Recording }) {
  const chapters = recording.chapters ?? [];
  const current = currentChapterIndex(recording.positionSec, chapters.map((c) => c.startSec));
  return (
    <Sheet open={open} onClose={onClose} title={t.player.chapters}>
      <div className={styles.list}>
        {chapters.map((c, i) => (
          <button
            key={c.title}
            className={`${styles.option} ${i === current ? styles.current : ''}`}
            aria-current={i === current ? 'true' : undefined}
            onClick={() => {
              usePlayer.getState().seek(c.startSec);
              onClose();
            }}
          >
            <span>{c.title}</span>
            <span className={styles.time}>{formatClock(c.startSec)}</span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
