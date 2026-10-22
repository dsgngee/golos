import { useNav } from '../../app/navigation';
import { t } from '../../content/ru';
import { FORMS, countLabel } from '../../i18n/format';
import { continueCandidate, selectRecordings, useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { useVoice } from '../../store/voice';
import { Button } from '../../ui/Button';
import { EmptyState } from '../../ui/EmptyState';
import { Icon } from '../../ui/icons';
import { RecordingRow } from '../../ui/RecordingRow';
import { ContinueCard } from './ContinueCard';
import styles from './LibraryHome.module.css';
import { VoiceMissingRow } from './VoiceMissingRow';

const RECENT_COUNT = 5;

export function LibraryHome() {
  const recordings = useLibrary((s) => s.recordings);
  const voiceMissing = useVoice((s) => s.status === 'none');
  const nav = useNav.getState();
  const cont = continueCandidate(recordings);
  const recent = selectRecordings(recordings, { sort: 'recent' })
    .filter((r) => r.id !== cont?.id)
    .slice(0, RECENT_COUNT);

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <h1 className={styles.title}>{t.library.title}</h1>
        <span className={styles.count}>{countLabel(recordings.length, FORMS.recording)}</span>
        <button className={styles.search} aria-label={t.library.search} onClick={() => nav.push({ name: 'library.search' })}>
          <Icon name="search" />
        </button>
      </header>

      {voiceMissing && <VoiceMissingRow />}

      {recordings.length === 0 ? (
        <EmptyState
          title={t.library.emptyTitle}
          body={t.library.emptyBody}
          action={{ label: t.library.create, onClick: () => nav.switchTab('create') }}
        />
      ) : (
        <>
          {cont && <ContinueCard recording={cont} />}
          <Button
            variant="outline"
            className={styles.create}
            trailing="+"
            onClick={() => nav.switchTab('create')}
          >
            {t.library.create}
          </Button>
          <section>
            <h2 className={styles.section}>{t.library.recent}</h2>
            {recent.map((r, i) => (
              <RecordingRow
                key={r.id}
                recording={r}
                index={i + 1}
                onPress={() => usePlayer.getState().open(r.id, { autoplay: true })}
              />
            ))}
            <button className={styles.all} onClick={() => nav.push({ name: 'library.search' })}>
              <span>{t.library.all}</span>
              <Icon name="chevronRight" size={18} />
            </button>
          </section>
        </>
      )}
    </div>
  );
}
