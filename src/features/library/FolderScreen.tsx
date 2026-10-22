import { useNav } from '../../app/navigation';
import type { ScreenProps } from '../../app/screens';
import { t } from '../../content/ru';
import { selectRecordings, useLibrary } from '../../store/library';
import { EmptyState } from '../../ui/EmptyState';
import { NavBar } from '../../ui/NavBar';
import { RecordingList } from './RecordingList';
import styles from './SearchScreen.module.css';

export function FolderScreen({ params }: ScreenProps) {
  const folderId = params?.folderId ?? '';
  const folder = useLibrary((s) => s.folders.find((f) => f.id === folderId));
  const recordings = useLibrary((s) => s.recordings);
  const items = selectRecordings(recordings, { folderId });

  return (
    <div>
      <NavBar title={folder?.name} onBack={() => useNav.getState().pop()} />
      <div className={styles.page}>
        {items.length === 0 ? (
          <EmptyState title={t.folderScreen.emptyTitle} body={t.folderScreen.emptyBody} />
        ) : (
          <RecordingList recordings={items} />
        )}
      </div>
    </div>
  );
}
