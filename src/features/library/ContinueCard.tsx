import { t } from '../../content/ru';
import type { Recording } from '../../data/types';
import { formatClock, formatRemaining } from '../../i18n/format';
import { usePlayer } from '../../store/player';
import { useSettings } from '../../store/settings';
import { PlayButton } from '../../ui/PlayButton';
import { ProgressLine } from '../../ui/ProgressLine';
import { SkipButton } from '../../ui/SkipButton';
import { control } from '../player/control';
import styles from './ContinueCard.module.css';

export function ContinueCard({ recording: r }: { recording: Recording }) {
  const step = useSettings((s) => s.skipStep);
  const playing = usePlayer((s) => s.currentId === r.id && s.isPlaying);

  return (
    <section className={styles.card}>
      <button className={styles.head} onClick={() => usePlayer.getState().open(r.id, { expand: true })}>
        <span className={styles.label}>{t.library.continue}</span>
        <span className={styles.title}>{r.title}</span>
        {r.meta && <span className={styles.meta}>{r.meta}</span>}
      </button>
      <ProgressLine tone="onInverse" valueSec={r.positionSec} max={r.durationSec} onSeek={(s) => control.seek(r.id, s)} />
      <div className={styles.times}>
        <span>{formatClock(r.positionSec)}</span>
        <span>{formatRemaining(r.durationSec - r.positionSec)}</span>
      </div>
      <div className={styles.controls}>
        <SkipButton direction="back" step={step} onClick={() => control.skip(r.id, -step)} />
        <PlayButton playing={playing} onToggle={() => control.toggle(r.id)} />
        <SkipButton direction="forward" step={step} onClick={() => control.skip(r.id, step)} />
      </div>
    </section>
  );
}
