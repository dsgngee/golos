import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { t } from '../content/ru';
import { formatClock } from '../i18n/format';
import styles from './ProgressLine.module.css';

interface Props {
  valueSec: number;
  max: number;
  onSeek(sec: number): void;
  tone?: 'onInverse' | 'onBg';
}

const KEY_STEP = 5;

export function ProgressLine({ valueSec, max, onSeek, tone = 'onBg' }: Props) {
  const dragging = useRef(false);
  const ratio = max > 0 ? Math.min(1, Math.max(0, valueSec / max)) : 0;

  const seekFromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const r = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeek(r * max);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowUp'
        ? valueSec + KEY_STEP
        : e.key === 'ArrowLeft' || e.key === 'ArrowDown'
          ? valueSec - KEY_STEP
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? max
              : null;
    if (next === null) return;
    e.preventDefault();
    onSeek(Math.min(max, Math.max(0, next)));
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={t.player.position}
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(valueSec)}
      aria-valuetext={t.player.progressOf(formatClock(valueSec), formatClock(max))}
      className={`${styles.slider} ${styles[tone]}`}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        seekFromPointer(e);
      }}
      onPointerMove={(e) => dragging.current && seekFromPointer(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${ratio * 100}%` }} />
        <div className={styles.dot} style={{ left: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}
