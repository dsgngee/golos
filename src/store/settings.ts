import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Rate, SleepOption } from '../data/types';
import { persistOptions } from './persist';

export type ThemeSetting = 'light' | 'dark' | 'system';
export type SkipStep = 10 | 15 | 30;

export interface SettingsData {
  name: string;
  theme: ThemeSetting;
  defaultRate: Rate;
  skipStep: SkipStep;
  defaultSleep: SleepOption;
  notifyReady: boolean;
}

export const defaultSettings: SettingsData = {
  name: 'Алексей',
  theme: 'light',
  defaultRate: 1,
  skipStep: 15,
  defaultSleep: 30,
  notifyReady: true,
};

interface SettingsState extends SettingsData {
  set<K extends keyof SettingsData>(k: K, v: SettingsData[K]): void;
  reset(): void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      set: (k, v) => set({ [k]: v } as Partial<SettingsData>),
      reset: () => set({ ...defaultSettings }),
    }),
    persistOptions<SettingsState, SettingsData>('settings', () => ({ ...defaultSettings }), (s) => ({
      name: s.name,
      theme: s.theme,
      defaultRate: s.defaultRate,
      skipStep: s.skipStep,
      defaultSleep: s.defaultSleep,
      notifyReady: s.notifyReady,
    })),
  ),
);
