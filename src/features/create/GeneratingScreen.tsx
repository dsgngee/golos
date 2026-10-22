import { useNav } from '../../app/navigation';
import type { ScreenProps } from '../../app/screens';
import { t } from '../../content/ru';
import { useGeneration } from '../../store/generation';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { Button } from '../../ui/Button';
import { useDraft } from './draft';
import styles from './create.module.css';

export function GeneratingScreen({ params }: ScreenProps) {
  const id = params?.id ?? '';
  const rec = useLibrary((s) => s.recordings.find((r) => r.id === id));
  const job = useGeneration((s) => s.jobs.find((j) => j.recordingId === id));
  const done = !!rec && rec.generationProgress === undefined;
  const progress = rec?.generationProgress ?? 1;
  const secondsLeft = job ? Math.max(1, Math.ceil((job.totalMs - job.elapsedMs) / 1000)) : 0;

  const toLibrary = () => {
    const nav = useNav.getState();
    nav.switchTab('library');
    nav.popToRoot('create');
    useDraft.getState().resetDraft();
  };

  return (
    <div className={styles.page}>
      <div className={styles.generating}>
        <p className={styles.label}>{done ? t.create.doneTitle : t.create.generatingTitle}</p>
        {rec && <h1 className={styles.genTitle}>{rec.title}</h1>}
        {!done && (
          <>
            <p className={styles.percent} aria-live="polite">
              {Math.round(progress * 100)} %
            </p>
            <div className={styles.bar} aria-hidden="true">
              <span style={{ width: `${progress * 100}%` }} />
            </div>
            {job && <p className={styles.stats}>{t.create.remaining(secondsLeft)}</p>}
            <p className={styles.hintSmall}>{t.create.canLeave}</p>
          </>
        )}
      </div>
      {done && rec && (
        <Button
          onClick={() => {
            usePlayer.getState().open(rec.id, { expand: true, autoplay: true });
            toLibrary();
          }}
        >
          {t.create.listen}
        </Button>
      )}
      {done && (
        <Button
          variant="outline"
          onClick={() => {
            useDraft.getState().resetDraft();
            useNav.getState().popToRoot('create');
            useNav.setState({ tab: 'create' });
          }}
        >
          {t.create.another}
        </Button>
      )}
      <Button variant={done ? 'plain' : 'outline'} onClick={toLibrary}>
        {t.create.toLibrary}
      </Button>
    </div>
  );
}
