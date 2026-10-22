import { t } from '../content/ru';
import { Icon } from './icons';
import styles from './PlayButton.module.css';

interface Props {
  playing: boolean;
  onToggle(): void;
  size?: 'l' | 'm';
  /** quiet = ohne Akzentfläche, für Nebenaktionen (nur ein oranger Fokuspunkt pro Screen) */
  tone?: 'accent' | 'quiet';
}

export function PlayButton({ playing, onToggle, size = 'l', tone = 'accent' }: Props) {
  return (
    <button
      className={`${styles.play} ${styles[size]} ${styles[tone]}`}
      aria-label={playing ? t.player.pause : t.player.play}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <span className={playing ? '' : styles.nudge}>
        <Icon name={playing ? 'pause' : 'play'} size={size === 'l' ? 20 : 16} />
      </span>
    </button>
  );
}
