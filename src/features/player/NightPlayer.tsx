import { t } from '../../content/ru';
import type { SleepOption } from '../../data/types';
import { formatClock, formatRemaining } from '../../i18n/format';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { useSettings } from '../../store/settings';
import { Chip } from '../../ui/Chip';
import { Icon } from '../../ui/icons';
import { PlayButton } from '../../ui/PlayButton';
import { ProgressLine } from '../../ui/ProgressLine';
import { SkipButton } from '../../ui/SkipButton';
import styles from './NightPlayer.module.css';

const QUICK: SleepOption[] = [15, 30, 45, 60, 'off'];
const FADE_MS = 60_000;

export function NightPlayer() {
  const p = usePlayer();
  const step = useSettings((s) => s.skipStep);
  const rec = useLibrary((s) => s.recordings.find((r) => r.id === p.currentId));
  if (!rec) return null;

  const remaining = p.sleep.remainingMs;

  return (
    <section className={styles.night} data-theme="night" data-testid="night-player" role="dialog" aria-modal="true" aria-label={rec.title}>
      <button className={styles.collapse} aria-label={t.player.collapse} onClick={() => p.setExpanded(false)}>
        <Icon name="chevronDown" size={28} />
      </button>

      <h2 className={styles.title}>{rec.title}</h2>

      <div className={styles.timer}>
        <p className={styles.timerLabel}>{t.player.sleepTitle}</p>
        <p className={`${styles.timerValue} ${p.sleep.option === 'chapterEnd' ? styles.timerText : ''}`}>
          {remaining !== null ? formatClock(remaining / 1000) : p.sleep.option === 'chapterEnd' ? t.player.chapterEnd : t.night.timerOff}
        </p>
        {remaining !== null && remaining < FADE_MS && <p className={styles.fading}>{t.night.fading}</p>}
        <div className={styles.chips}>
          {QUICK.map((o) => (
            <Chip key={String(o)} selected={p.sleep.option === o} onClick={() => p.setSleep(o)}>
              {o === 'off' ? t.player.sleepOff : t.player.minutes(o as number)}
            </Chip>
          ))}
        </div>
      </div>

      <ProgressLine valueSec={rec.positionSec} max={rec.durationSec} onSeek={p.seek} />
      <div className={styles.times}>
        <span>{formatClock(rec.positionSec)}</span>
        <span>{formatRemaining(rec.durationSec - rec.positionSec)}</span>
      </div>

      <div className={styles.controls}>
        <SkipButton direction="back" step={step} onClick={() => p.skip(-step)} size={38} />
        <PlayButton playing={p.isPlaying} onToggle={p.toggle} />
        <SkipButton direction="forward" step={step} onClick={() => p.skip(step)} size={38} />
      </div>

      <button className={styles.exit} onClick={() => p.setNightMode(false)}>
        <Icon name="moon" size={20} />
        <span>{t.night.exit}</span>
      </button>
    </section>
  );
}
