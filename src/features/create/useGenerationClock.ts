import { useEffect } from 'react';
import { useGeneration } from '../../store/generation';

export const GENERATION_TICK_MS = 250;

/** Treibt die simulierte Vertonung an, solange Aufträge laufen. */
export function useGenerationClock() {
  const active = useGeneration((s) => s.jobs.length > 0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => useGeneration.getState().tick(GENERATION_TICK_MS), GENERATION_TICK_MS);
    return () => clearInterval(id);
  }, [active]);
}
