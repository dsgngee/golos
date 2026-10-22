import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Rate, Recording, SleepOption } from '../data/types';
import { useLibrary } from './library';
import { persistOptions } from './persist';
import { useSettings } from './settings';

export interface SleepState {
  option: SleepOption;
  remainingMs: number | null;
}

interface PlayerData {
  currentId: string | null;
  isPlaying: boolean;
  rate: Rate;
  expanded: boolean;
  nightMode: boolean;
  readAlong: boolean;
  sleep: SleepState;
}

interface PlayerState extends PlayerData {
  open(id: string, opts?: { expand?: boolean; autoplay?: boolean }): void;
  close(): void;
  play(): void;
  pause(): void;
  toggle(): void;
  seek(sec: number): void;
  skip(deltaSec: number): void;
  setRate(r: Rate): void;
  setSleep(o: SleepOption): void;
  setExpanded(b: boolean): void;
  setNightMode(b: boolean): void;
  setReadAlong(b: boolean): void;
  tick(ms: number): void;
  reset(): void;
}

const SLEEP_OFF: SleepState = { option: 'off', remainingMs: null };

const sleepFor = (o: SleepOption): SleepState => ({
  option: o,
  remainingMs: typeof o === 'number' ? o * 60_000 : null,
});

const initial = (): PlayerData => ({
  currentId: null,
  isPlaying: false,
  rate: useSettings.getState().defaultRate,
  expanded: false,
  nightMode: false,
  readAlong: false,
  sleep: SLEEP_OFF,
});

const find = (id: string | null): Recording | undefined =>
  id ? useLibrary.getState().recordings.find((r) => r.id === id) : undefined;

const setPosition = (id: string, sec: number) => useLibrary.getState().update(id, { positionSec: sec });

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      ...initial(),
      open: (id, opts = {}) => {
        const rec = find(id);
        if (!rec) return;
        useLibrary.getState().update(id, { lastPlayedAt: new Date().toISOString() });
        const next: Partial<PlayerData> = {
          currentId: id,
          expanded: opts.expand ?? false,
          isPlaying: false,
        };
        if (rec.type === 'tale') {
          next.nightMode = true;
          if (get().sleep.option === 'off') next.sleep = sleepFor(useSettings.getState().defaultSleep);
        }
        set(next);
        if (opts.autoplay) get().play();
      },
      close: () => set({ currentId: null, isPlaying: false, expanded: false, nightMode: false, sleep: SLEEP_OFF }),
      play: () => {
        const rec = find(get().currentId);
        if (!rec) return;
        if (rec.positionSec >= rec.durationSec) setPosition(rec.id, 0);
        set({ isPlaying: true });
      },
      pause: () => set({ isPlaying: false }),
      toggle: () => (get().isPlaying ? get().pause() : get().play()),
      seek: (sec) => {
        const rec = find(get().currentId);
        if (!rec) return;
        setPosition(rec.id, Math.min(rec.durationSec, Math.max(0, sec)));
      },
      skip: (delta) => {
        const rec = find(get().currentId);
        if (rec) get().seek(rec.positionSec + delta);
      },
      setRate: (rate) => set({ rate }),
      setSleep: (o) => set({ sleep: sleepFor(o) }),
      setExpanded: (expanded) => set({ expanded }),
      setNightMode: (nightMode) => set({ nightMode }),
      setReadAlong: (readAlong) => set({ readAlong }),
      tick: (ms) => {
        const s = get();
        if (!s.currentId) return;
        const rec = find(s.currentId);
        if (!rec) {
          get().close();
          return;
        }
        if (!s.isPlaying) return;

        const next: Partial<PlayerData> = {};
        let newPos = rec.positionSec + (ms / 1000) * s.rate;
        let sleepEnded = false;

        if (s.sleep.option === 'chapterEnd' && rec.chapters) {
          const nextStart = rec.chapters.map((c) => c.startSec).find((start) => start > rec.positionSec);
          if (nextStart !== undefined && newPos >= nextStart) {
            newPos = nextStart;
            sleepEnded = true;
          }
        }
        if (newPos >= rec.durationSec) {
          newPos = rec.durationSec;
          next.isPlaying = false;
        }
        if (s.sleep.remainingMs !== null) {
          const rem = s.sleep.remainingMs - ms;
          if (rem <= 0) sleepEnded = true;
          else next.sleep = { ...s.sleep, remainingMs: rem };
        }
        if (sleepEnded) {
          next.isPlaying = false;
          next.sleep = SLEEP_OFF;
          next.nightMode = false;
        }
        setPosition(rec.id, newPos);
        set(next);
      },
      reset: () => set(initial()),
    }),
    persistOptions<PlayerState, Pick<PlayerData, 'currentId' | 'rate'>>(
      'player',
      () => ({ currentId: null, rate: 1 }),
      (s) => ({ currentId: s.currentId, rate: s.rate }),
    ),
  ),
);
