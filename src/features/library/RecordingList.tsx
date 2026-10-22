import { useState } from 'react';
import type { Recording } from '../../data/types';
import { usePlayer } from '../../store/player';
import { RecordingRow } from '../../ui/RecordingRow';
import { RecordingActions } from './RecordingActions';
import { useLongPress } from './useLongPress';

function Row({ recording, index, onActions }: { recording: Recording; index: number; onActions(): void }) {
  const longPress = useLongPress(onActions);
  return (
    <RecordingRow
      recording={recording}
      index={index}
      onPress={() => usePlayer.getState().open(recording.id, { autoplay: true })}
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
