import { useState } from 'react';
import { useNav } from '../../app/navigation';
import type { ScreenProps } from '../../app/screens';
import { languageName, styleName, t } from '../../content/ru';
import type { Cover } from '../../data/types';
import { useGeneration } from '../../store/generation';
import { useLibrary } from '../../store/library';
import { useVoice } from '../../store/voice';
import { ActionSheet } from '../../ui/ActionSheet';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/icons';
import { NavBar } from '../../ui/NavBar';
import { TextField } from '../../ui/TextField';
import { deleteRecording } from './actions';
import { CoverPicker } from './CoverPicker';
import styles from './EditScreen.module.css';
import { FolderPicker } from './FolderPicker';
import { TagEditor } from './TagEditor';

export function EditScreen({ params }: ScreenProps) {
  const id = params?.id ?? '';
  const rec = useLibrary((s) => s.recordings.find((r) => r.id === id));
  const folders = useLibrary((s) => s.folders);
  const voiceReady = useVoice((s) => s.status === 'ready');
  const [title, setTitle] = useState(rec?.title ?? '');
  const [cover, setCover] = useState<Cover>(rec?.cover ?? { kind: 'typo', tone: 'ink' });
  const [tags, setTags] = useState<string[]>(rec?.tags ?? []);
  const [folderId, setFolderId] = useState<string | null>(rec?.folderId ?? null);
  const [folderOpen, setFolderOpen] = useState(false);
  const [confirm, setConfirm] = useState<'revoice' | 'delete' | null>(null);

  if (!rec) return null;
  const nav = useNav.getState();
  const glyph = rec.cover.kind === 'typo' ? rec.cover.glyph : undefined;

  const save = () => {
    const lib = useLibrary.getState();
    lib.rename(rec.id, title);
    lib.setCover(rec.id, cover);
    lib.setTags(rec.id, tags);
    lib.moveToFolder(rec.id, folderId);
    nav.pop();
  };

  return (
    <div>
      <NavBar
        title={t.edit.title}
        onBack={() => nav.pop()}
        right={
          <Button variant="plain" full={false} disabled={!title.trim()} onClick={save}>
            {t.common.done}
          </Button>
        }
      />
      <div className={styles.page}>
        <TextField label={t.edit.name} value={title} onChange={setTitle} />
        <CoverPicker cover={cover} title={title || rec.title} glyph={glyph} onChange={setCover} />
        <TagEditor tags={tags} onChange={setTags} />

        <button className={styles.row} onClick={() => setFolderOpen(true)}>
          <span className={styles.rowLabel}>{t.folder.label}</span>
          <span className={styles.rowValue}>{folders.find((f) => f.id === folderId)?.name ?? t.folder.none}</span>
          <Icon name="chevronRight" size={18} />
        </button>
        <div className={styles.info}>
          <span className={styles.rowLabel}>{t.edit.language}</span>
          <span className={styles.rowValue}>
            {languageName[rec.language]}
            {rec.translatedFrom ? ` · ${t.edit.translated}` : ''}
          </span>
        </div>
        <div className={styles.info}>
          <span className={styles.rowLabel}>{t.edit.style}</span>
          <span className={styles.rowValue}>{styleName[rec.style]}</span>
        </div>

        {voiceReady && rec.generationProgress === undefined && (
          <Button variant="outline" onClick={() => setConfirm('revoice')}>
            {t.edit.revoice}
          </Button>
        )}
        <Button variant="destructive" onClick={() => setConfirm('delete')}>
          {t.edit.delete}
        </Button>
      </div>

      <FolderPicker open={folderOpen} onClose={() => setFolderOpen(false)} value={folderId} onChange={setFolderId} />
      <ActionSheet
        open={confirm === 'revoice'}
        onClose={() => setConfirm(null)}
        title={t.actions.revoiceTitle(rec.title)}
        message={t.actions.revoiceBody}
        actions={[
          {
            label: t.actions.revoiceConfirm,
            onSelect: () => {
              useGeneration.getState().revoice(rec.id);
              nav.pop();
            },
          },
        ]}
      />
      <ActionSheet
        open={confirm === 'delete'}
        onClose={() => setConfirm(null)}
        title={t.actions.deleteTitle(rec.title)}
        message={t.actions.deleteBody}
        actions={[
          {
            label: t.actions.deleteConfirm,
            destructive: true,
            onSelect: () => {
              nav.pop();
              deleteRecording(rec.id);
            },
          },
        ]}
      />
    </div>
  );
}
