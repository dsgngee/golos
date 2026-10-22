import { t } from '../../content/ru';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { Cover } from '../../ui/Cover';
import { PlayButton } from '../../ui/PlayButton';
import styles from './MiniPlayer.module.css';

export function MiniPlayer() {
  const currentId = usePlayer((s) => s.currentId);
  const expanded = usePlayer((s) => s.expanded);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const rec = useLibrary((s) => s.recordings.find((r) => r.id === currentId));

  if (!rec || expanded) return null;
  const expand = () => usePlayer.getState().setExpanded(true);

  return (
    <div className={styles.mini} data-testid="mini-player" onClick={expand}>
      <button className={styles.open} aria-label={`${t.mini.open}: ${rec.title}`}>
        <Cover cover={rec.cover} title={rec.title} size="s" />
        <span className={styles.title}>{rec.title}</span>
      </button>
      <PlayButton size="m" playing={isPlaying} onToggle={() => usePlayer.getState().toggle()} />
      <span className={styles.progress} aria-hidden="true">
        <span style={{ width: `${(rec.positionSec / rec.durationSec) * 100}%` }} />
      </span>
    </div>
  );
}
