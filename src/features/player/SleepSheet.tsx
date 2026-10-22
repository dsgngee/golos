import { t } from '../../content/ru';
import type { SleepOption } from '../../data/types';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { Icon } from '../../ui/icons';
import { Sheet } from '../../ui/Sheet';
import styles from './sheets.module.css';

const label = (o: SleepOption) =>
  o === 'off' ? t.player.sleepOff : o === 'chapterEnd' ? t.player.chapterEnd : t.player.minutes(o);

export function SleepSheet({ open, onClose }: { open: boolean; onClose(): void }) {
  const option = usePlayer((s) => s.sleep.option);
  const hasChapters = useLibrary((s) => !!s.recordings.find((r) => r.id === usePlayer.getState().currentId)?.chapters);
  const options: SleepOption[] = ['off', 15, 30, 45, 60, ...(hasChapters ? (['chapterEnd'] as const) : [])];

  return (
    <Sheet open={open} onClose={onClose} title={t.player.sleepTitle}>
      <div className={styles.list}>
        {options.map((o) => (
          <button
            key={String(o)}
            className={styles.option}
            aria-pressed={option === o}
            onClick={() => {
              usePlayer.getState().setSleep(o);
              onClose();
            }}
          >
            <span>{label(o)}</span>
            {option === o && <Icon name="check" size={20} />}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
