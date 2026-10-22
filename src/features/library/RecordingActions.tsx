import { useRef, useState } from 'react';
import { useNav } from '../../app/navigation';
import { t } from '../../content/ru';
import { useGeneration } from '../../store/generation';
import { statusOf, useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { useVoice } from '../../store/voice';
import { ActionSheet, type SheetAction } from '../../ui/ActionSheet';
import { deleteRecording } from './actions';

type Confirm = 'revoice' | 'delete';

interface Props {
  recordingId: string | null;
  onClose(): void;
}

export function RecordingActions({ recordingId, onClose }: Props) {
  const rec = useLibrary((s) => s.recordings.find((r) => r.id === recordingId));
  const voiceReady = useVoice((s) => s.status === 'ready');
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  // Ein Menüpunkt öffnet eine Bestätigung; das Schließen des Menüs darf sie dann nicht mit beenden.
  const pending = useRef<Confirm | null>(null);

  const closeAll = () => {
    pending.current = null;
    setConfirm(null);
    onClose();
  };
  const ask = (k: Confirm) => {
    pending.current = k;
    setConfirm(k);
  };

  if (!rec) return null;
  const generating = statusOf(rec) === 'generating';

  const actions: SheetAction[] = [
    ...(generating ? [] : [{ label: t.actions.listen, onSelect: () => usePlayer.getState().open(rec.id, { expand: true, autoplay: true }) }]),
    { label: t.actions.edit, onSelect: () => useNav.getState().push({ name: 'library.edit', params: { id: rec.id } }) },
    ...(voiceReady && !generating ? [{ label: t.actions.revoice, onSelect: () => ask('revoice') }] : []),
    { label: t.actions.delete, destructive: true, onSelect: () => ask('delete') },
  ];

  return (
    <>
      <ActionSheet
        open={confirm === null}
        onClose={() => {
          if (!pending.current) onClose();
        }}
        title={rec.title}
        actions={actions}
      />
      <ActionSheet
        open={confirm === 'revoice'}
        onClose={closeAll}
        title={t.actions.revoiceTitle(rec.title)}
        message={t.actions.revoiceBody}
        actions={[{ label: t.actions.revoiceConfirm, onSelect: () => useGeneration.getState().revoice(rec.id) }]}
      />
      <ActionSheet
        open={confirm === 'delete'}
        onClose={closeAll}
        title={t.actions.deleteTitle(rec.title)}
        message={t.actions.deleteBody}
        actions={[{ label: t.actions.deleteConfirm, destructive: true, onSelect: () => deleteRecording(rec.id) }]}
      />
    </>
  );
}
