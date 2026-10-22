import { create } from 'zustand';
import type { Chapter, LanguageCode, ReadingStyle, RecordingType } from '../../data/types';
import { splitSentences } from '../player/sentences';

export interface Draft {
  source: 'text' | 'pdf' | 'link';
  type: RecordingType;
  text: string;
  simulatedWords?: number;
  chapters?: Chapter[];
  title: string;
  folderId: string | null;
  tags: string[];
  language: LanguageCode;
  translateTo: LanguageCode | null;
  style: ReadingStyle;
}

export const emptyDraft = (): Draft => ({
  source: 'text',
  type: 'article',
  text: '',
  title: '',
  folderId: null,
  tags: [],
  language: 'ru',
  translateTo: null,
  style: 'normal',
});

interface DraftState {
  draft: Draft;
  setDraft(p: Partial<Draft>): void;
  resetDraft(): void;
}

export const useDraft = create<DraftState>()((set, get) => ({
  draft: emptyDraft(),
  setDraft: (p) => set({ draft: { ...get().draft, ...p } }),
  resetDraft: () => set({ draft: emptyDraft() }),
}));

export const WORDS_PER_MINUTE = 150;
const MAX_TITLE = 60;

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateSec(words: number): number {
  return Math.round((words / WORDS_PER_MINUTE) * 60);
}

export function draftWords(d: Draft): number {
  return d.simulatedWords ?? wordCount(d.text);
}

export function suggestTitle(text: string): string {
  const first = (splitSentences(text)[0] ?? '').replace(/[.!?…]+$/, '').trim();
  if (first.length <= MAX_TITLE) return first;
  return first.slice(0, MAX_TITLE - 1).trimEnd() + '…';
}
