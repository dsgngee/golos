import { useState } from 'react';
import { useNav } from '../../app/navigation';
import type { Recording } from '../../data/types';
import { statusOf } from '../../store/library';
import { usePlayer } from '../../store/player';
import { RecordingRow } from '../../ui/RecordingRow';
import { RecordingActions } from './RecordingActions';
import { useLongPress } from './useLongPress';

function press(r: Recording) {
  // Noch nicht vertont: Fortschritt zeigen statt „abspielen“.
  if (statusOf(r) === 'generating') useNav.getState().push({ name: 'create.generating', params: { id: r.id } });
  else usePlayer.getState().open(r.id, { autoplay: true });
}

function Row({ recording, index, onActions }: { recording: Recording; index: number; onActions(): void }) {
  const longPress = useLongPress(onActions);
  return (
    <RecordingRow
      recording={recording}
      index={index}
      onPress={() => press(recording)}
      onMore={onActions}
      pressProps={longPress}
    />
  );
}

/** Nummerierte Liste von Aufnahmen: Tippen startet die Wiedergabe, „…“ oder langes Drücken öffnet die Aktionen. */
export function RecordingList({ recordings }: { recordings: Recording[] }) {
  const [actionsId, setActionsId] = useState<string | null>(null);
  return (
    <div>
      {recordings.map((r, i) => (
        <Row key={r.id} recording={r} index={i + 1} onActions={() => setActionsId(r.id)} />
      ))}
      <RecordingActions recordingId={actionsId} onClose={() => setActionsId(null)} />
    </div>
  );
}
