import type { Recording } from '../../data/types';
import { usePlayer } from '../../store/player';
import { RecordingRow } from '../../ui/RecordingRow';

interface Props {
  recordings: Recording[];
  onMore?(r: Recording): void;
}

/** Nummerierte Liste von Aufnahmen; Tippen startet die Wiedergabe. */
export function RecordingList({ recordings, onMore }: Props) {
  return (
    <div>
      {recordings.map((r, i) => (
        <RecordingRow
          key={r.id}
          recording={r}
          index={i + 1}
          onPress={() => usePlayer.getState().open(r.id, { autoplay: true })}
          onMore={onMore ? () => onMore(r) : undefined}
        />
      ))}
    </div>
  );
}
