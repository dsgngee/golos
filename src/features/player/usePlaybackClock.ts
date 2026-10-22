import { useEffect } from 'react';
import { usePlayer } from '../../store/player';

export const PLAYBACK_TICK_MS = 250;

/** Treibt die simulierte Wiedergabe an, solange etwas läuft. */
export function usePlaybackClock() {
  const isPlaying = usePlayer((s) => s.isPlaying);
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => usePlayer.getState().tick(PLAYBACK_TICK_MS), PLAYBACK_TICK_MS);
    return () => clearInterval(id);
  }, [isPlaying]);
}
