import { t } from '../content/ru';
import { Icon } from './icons';
import styles from './PlayButton.module.css';

interface Props {
  playing: boolean;
  onToggle(): void;
  size?: 'l' | 'm';
}

export function PlayButton({ playing, onToggle, size = 'l' }: Props) {
  return (
    <button
      className={`${styles.play} ${styles[size]}`}
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
