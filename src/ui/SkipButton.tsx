import { t } from '../content/ru';
import styles from './SkipButton.module.css';

interface Props {
  direction: 'back' | 'forward';
  step: number;
  onClick(): void;
  size?: number;
}

export function SkipButton({ direction, step, onClick, size = 34 }: Props) {
  const back = direction === 'back';
  return (
    <button
      className={styles.skip}
      aria-label={back ? t.player.skipBack(step) : t.player.skipForward(step)}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" className={styles.icon}>
        {back ? (
          <>
            <path d="M4.6 12a7.4 7.4 0 1 0 2.3-5.4" />
            <path d="M4.4 3.6v3.6H8" />
          </>
        ) : (
          <>
            <path d="M19.4 12a7.4 7.4 0 1 1-2.3-5.4" />
            <path d="M19.6 3.6v3.6H16" />
          </>
        )}
        <text x={back ? 12.4 : 11.6} y="14.6" textAnchor="middle" className={styles.num}>
          {step}
        </text>
      </svg>
    </button>
  );
}
