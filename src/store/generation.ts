import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { languageName, t } from '../content/ru';
import type { Recording } from '../data/types';
import { draftWords, estimateSec, suggestTitle, type Draft } from '../features/create/draft';
import { cleanTags, useLibrary } from './library';
import { persistOptions } from './persist';
import { usePlayer } from './player';
import { useSettings } from './settings';
import { useUi } from './ui';

export interface Job {
  recordingId: string;
  elapsedMs: number;
  totalMs: number;
}

interface GenerationState {
  jobs: Job[];
  start(d: Draft): string;
  revoice(id: string): void;
  tick(ms: number): void;
  reset(): void;
}

/** Simulierte Dauer der Vertonung: 8 ms pro Audiosekunde, begrenzt auf 6–20 s. */
export function jobDurationMs(durationSec: number): number {
  return Math.min(20_000, Math.max(6_000, durationSec * 8));
}

const newId = () => `rec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export const useGeneration = create<GenerationState>()(
  persist(
    (set, get) => ({
      jobs: [],
      start: (d) => {
        const durationSec = estimateSec(draftWords(d));
        const id = newId();
        const translated = d.translateTo && d.translateTo !== d.language;
        const rec: Recording = {
          id,
          title: d.title.trim() || suggestTitle(d.text),
          type: d.type,
          meta: translated ? t.create.translatedMeta(languageName[d.translateTo!]) : undefined,
          durationSec,
          positionSec: 0,
          generationProgress: 0,
          folderId: d.folderId,
          tags: cleanTags(d.tags),
          cover: { kind: 'typo', tone: d.type === 'tale' ? 'accent' : 'ink' },
          language: translated ? d.translateTo! : d.language,
          translatedFrom: translated ? d.language : undefined,
          style: d.style,
          createdAt: new Date().toISOString(),
          chapters: d.chapters,
          text: d.text,
        };
        useLibrary.getState().add(rec);
        set({ jobs: [...get().jobs, { recordingId: id, elapsedMs: 0, totalMs: jobDurationMs(durationSec) }] });
        return id;
      },
      revoice: (id) => {
        const rec = useLibrary.getState().recordings.find((r) => r.id === id);
        if (!rec) return;
        if (usePlayer.getState().currentId === id) usePlayer.getState().close();
        useLibrary.getState().update(id, { generationProgress: 0, positionSec: 0 });
        const others = get().jobs.filter((j) => j.recordingId !== id);
        set({ jobs: [...others, { recordingId: id, elapsedMs: 0, totalMs: jobDurationMs(rec.durationSec) }] });
      },
      tick: (ms) => {
        const lib = useLibrary.getState();
        const remaining: Job[] = [];
        for (const job of get().jobs) {
          const rec = lib.recordings.find((r) => r.id === job.recordingId);
          if (!rec) continue;
          const elapsedMs = job.elapsedMs + ms;
          if (elapsedMs >= job.totalMs) {
            lib.update(rec.id, { generationProgress: undefined });
            if (useSettings.getState().notifyReady)
              useUi.getState().showBanner({ title: t.create.doneTitle, body: t.create.readyBody(rec.title), recordingId: rec.id });
          } else {
            lib.update(rec.id, { generationProgress: elapsedMs / job.totalMs });
            remaining.push({ ...job, elapsedMs });
          }
        }
        set({ jobs: remaining });
      },
      reset: () => set({ jobs: [] }),
    }),
    persistOptions<GenerationState, { jobs: Job[] }>('generation', () => ({ jobs: [] }), (s) => ({ jobs: s.jobs })),
  ),
);
