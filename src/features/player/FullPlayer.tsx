import { useState } from 'react';
import { t } from '../../content/ru';
import { formatClock, formatRate, formatRemaining } from '../../i18n/format';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { useSettings } from '../../store/settings';
import { Cover } from '../../ui/Cover';
import { Icon, type IconName } from '../../ui/icons';
import { PlayButton } from '../../ui/PlayButton';
import { ProgressLine } from '../../ui/ProgressLine';
import { SkipButton } from '../../ui/SkipButton';
import { ChaptersSheet } from './ChaptersSheet';
import styles from './FullPlayer.module.css';
import { ReadAlong } from './ReadAlong';
import { currentChapterIndex } from './sentences';
import { SleepSheet } from './SleepSheet';
import { TempoSheet } from './TempoSheet';

function Action({ icon, label, value, pressed, onClick }: { icon: IconName; label: string; value?: string; pressed?: boolean; onClick(): void }) {
  return (
    <button
      className={`${styles.action} ${pressed ? styles.pressed : ''}`}
      aria-label={value ? `${label} ${value}` : label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      <Icon name={icon} size={22} />
      <span className={styles.actionLabel}>{value ?? label}</span>
    </button>
  );
}

export function FullPlayer() {
  const p = usePlayer();
  const step = useSettings((s) => s.skipStep);
  const rec = useLibrary((s) => s.recordings.find((r) => r.id === p.currentId));
  const [sheet, setSheet] = useState<'tempo' | 'sleep' | 'chapters' | null>(null);
  if (!rec) return null;

  const chapter = rec.chapters?.[currentChapterIndex(rec.positionSec, rec.chapters.map((c) => c.startSec))];
  const sleepValue = p.sleep.remainingMs !== null ? formatClock(p.sleep.remainingMs / 1000) : p.sleep.option === 'chapterEnd' ? t.player.chapterEnd : undefined;
  const close = () => setSheet(null);

  return (
    <section className={styles.player} role="dialog" aria-modal="true" aria-label={rec.title}>
      <button className={styles.collapse} aria-label={t.player.collapse} onClick={() => p.setExpanded(false)}>
        <Icon name="chevronDown" size={28} />
      </button>

      <div className={styles.art}>
        {p.readAlong ? <ReadAlong recording={rec} /> : <Cover cover={rec.cover} title={rec.title} size="l" />}
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{rec.title}</h2>
        {rec.meta && <p className={styles.meta}>{rec.meta}</p>}
        {chapter && <p className={styles.chapter}>{chapter.title}</p>}
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

      <div className={styles.actions}>
        <Action icon="speed" label={t.player.speed} value={formatRate(p.rate)} onClick={() => setSheet('tempo')} />
        <Action icon="timer" label={t.player.timer} value={sleepValue} pressed={p.sleep.option !== 'off'} onClick={() => setSheet('sleep')} />
        {rec.chapters && <Action icon="chapters" label={t.player.chapters} onClick={() => setSheet('chapters')} />}
        <Action icon="text" label={t.player.text} pressed={p.readAlong} onClick={() => p.setReadAlong(!p.readAlong)} />
        <Action icon="moon" label={t.player.night} onClick={() => p.setNightMode(true)} />
      </div>

      <TempoSheet open={sheet === 'tempo'} onClose={close} />
      <SleepSheet open={sheet === 'sleep'} onClose={close} />
      {rec.chapters && <ChaptersSheet open={sheet === 'chapters'} onClose={close} recording={rec} />}
    </section>
  );
}
