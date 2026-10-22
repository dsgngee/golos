import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistOptions } from './persist';

export type SetupStep = 'welcome' | 'expectation' | 'prepare' | 'record' | 'quality' | 'creating' | 'sample';
export type SessionId = 'story' | 'excerpt' | 'emotion';

interface VoiceData {
  onboardingDone: boolean;
  setupActive: boolean;
  status: 'none' | 'ready';
  quality: number;
  minutes: number;
  updatedAt: string | null;
  sessionsDone: SessionId[];
  setupStep: SetupStep;
  phraseIndex: number;
  forceTooQuiet: boolean;
}

interface VoiceState extends VoiceData {
  setSetupStep(s: SetupStep): void;
  setPhraseIndex(i: number): void;
  setForceTooQuiet(b: boolean): void;
  startSetup(): void;
  completeOnboarding(): void;
  finishSetup(now?: Date): void;
  finishSession(id: SessionId, now?: Date): void;
  deleteVoice(): void;
  reset(): void;
}

const initial = (): VoiceData => ({
  onboardingDone: false,
  setupActive: false,
  status: 'none',
  quality: 0,
  minutes: 0,
  updatedAt: null,
  sessionsDone: [],
  setupStep: 'welcome',
  phraseIndex: 0,
  forceTooQuiet: false,
});

const dataKeys = Object.keys(initial()) as (keyof VoiceData)[];

export const SETUP_QUALITY = 86;
export const SETUP_MINUTES = 10;
export const MAX_QUALITY = 97;

export const useVoice = create<VoiceState>()(
  persist(
    (set, get) => ({
      ...initial(),
      setSetupStep: (setupStep) => set({ setupStep }),
      setPhraseIndex: (phraseIndex) => set({ phraseIndex }),
      setForceTooQuiet: (forceTooQuiet) => set({ forceTooQuiet }),
      startSetup: () => set({ setupActive: true, setupStep: 'prepare', phraseIndex: 0 }),
      completeOnboarding: () => set({ onboardingDone: true, setupActive: false, setupStep: 'welcome', forceTooQuiet: false }),
      finishSetup: (now = new Date()) =>
        set({ status: 'ready', quality: SETUP_QUALITY, minutes: SETUP_MINUTES, updatedAt: now.toISOString() }),
      finishSession: (id, now = new Date()) => {
        const s = get();
        set({
          quality: Math.min(MAX_QUALITY, s.quality + 3),
          minutes: s.minutes + 5,
          sessionsDone: s.sessionsDone.includes(id) ? s.sessionsDone : [...s.sessionsDone, id],
          updatedAt: now.toISOString(),
        });
      },
      deleteVoice: () => set({ status: 'none', quality: 0, minutes: 0, sessionsDone: [], updatedAt: null }),
      reset: () => set(initial()),
    }),
    persistOptions<VoiceState, VoiceData>(
      'voice',
      initial,
      (s) => Object.fromEntries(dataKeys.map((k) => [k, s[k]])) as unknown as VoiceData,
    ),
  ),
);
