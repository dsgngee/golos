import { useState } from 'react';
import { useNav } from '../../app/navigation';
import { languageName, styleName, t } from '../../content/ru';
import type { LanguageCode, ReadingStyle } from '../../data/types';
import { useGeneration } from '../../store/generation';
import { useLibrary } from '../../store/library';
import { useVoice } from '../../store/voice';
import { Button } from '../../ui/Button';
import { Chip } from '../../ui/Chip';
import { Icon } from '../../ui/icons';
import { NavBar } from '../../ui/NavBar';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { TextField } from '../../ui/TextField';
import { Toggle } from '../../ui/Toggle';
import { FolderPicker } from '../library/FolderPicker';
import { TagEditor } from '../library/TagEditor';
import { useDraft } from './draft';
import styles from './create.module.css';

const TARGETS: LanguageCode[] = ['en', 'zh', 'es', 'de'];
const STYLES: ReadingStyle[] = ['normal', 'expressive', 'calm'];

export function OptionsScreen() {
  const draft = useDraft((s) => s.draft);
  const setDraft = useDraft((s) => s.setDraft);
  const voiceReady = useVoice((s) => s.status === 'ready');
  const folders = useLibrary((s) => s.folders);
  const [folderOpen, setFolderOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const folderName = folders.find((f) => f.id === draft.folderId)?.name ?? t.folder.none;

  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    const id = useGeneration.getState().start(draft);
    useNav.getState().push({ name: 'create.generating', params: { id } });
  };

  return (
    <div>
      <NavBar title={t.create.optionsTitle} onBack={() => useNav.getState().pop()} />
      <div className={styles.page}>
        <TextField label={t.create.name} value={draft.title} onChange={(title) => setDraft({ title })} />

        <button className={styles.row} onClick={() => setFolderOpen(true)}>
          <span className={styles.rowLabel}>{t.folder.label}</span>
          <span className={styles.rowValue}>{folderName}</span>
          <Icon name="chevronRight" size={18} />
        </button>

        <TagEditor tags={draft.tags} onChange={(tags) => setDraft({ tags })} />

        <div className={styles.group}>
          <p className={styles.label}>{t.create.language}</p>
          <p className={styles.value}>{languageName[draft.language]}</p>
          <Toggle
            label={t.create.translate}
            checked={draft.translateTo !== null}
            onChange={(on) => setDraft({ translateTo: on ? 'en' : null })}
          />
          {draft.translateTo && (
            <div className={styles.chips} role="group" aria-label={t.create.translateTo}>
              {TARGETS.map((l) => (
                <Chip key={l} selected={draft.translateTo === l} onClick={() => setDraft({ translateTo: l })}>
                  {languageName[l]}
                </Chip>
              ))}
            </div>
          )}
        </div>

        <div className={styles.group}>
          <p className={styles.label}>{t.create.style}</p>
          <SegmentedControl<ReadingStyle>
            ariaLabel={t.create.style}
            value={draft.style}
            onChange={(style) => setDraft({ style })}
            options={STYLES.map((s) => ({ value: s, label: styleName[s] }))}
          />
          {draft.style === 'calm' && <p className={styles.hintSmall}>{t.create.calmHint}</p>}
        </div>

        {voiceReady ? (
          <Button disabled={!draft.title.trim() || submitted} onClick={submit}>
            {t.create.submit}
          </Button>
        ) : (
          <div className={styles.group}>
            <p className={styles.hint}>{t.create.voiceMissing}</p>
            <Button onClick={() => useVoice.getState().startSetup()}>{t.create.setupFirst}</Button>
          </div>
        )}
      </div>
      <FolderPicker open={folderOpen} onClose={() => setFolderOpen(false)} value={draft.folderId} onChange={(folderId) => setDraft({ folderId })} />
    </div>
  );
}
