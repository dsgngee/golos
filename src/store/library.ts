import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { seedFolders, seedRecordings } from '../data/seed';
import type { Cover, Folder, Recording, RecordingType } from '../data/types';
import { normalizeSearch } from '../i18n/format';
import { persistOptions } from './persist';

export type RecordingStatus = 'new' | 'started' | 'finished' | 'generating';

export function statusOf(r: Recording): RecordingStatus {
  if (r.generationProgress !== undefined) return 'generating';
  if (r.positionSec >= r.durationSec) return 'finished';
  if (r.positionSec > 0) return 'started';
  return 'new';
}

export interface LibraryQuery {
  search?: string;
  type?: RecordingType | 'all';
  folderId?: string;
  tag?: string;
  sort?: 'recent' | 'title' | 'duration';
}

const recency = (r: Recording) => r.lastPlayedAt ?? r.createdAt;

export function selectRecordings(recordings: Recording[], q: LibraryQuery): Recording[] {
  const needle = q.search ? normalizeSearch(q.search) : '';
  const filtered = recordings.filter((r) => {
    if (q.type && q.type !== 'all' && r.type !== q.type) return false;
    if (q.folderId && r.folderId !== q.folderId) return false;
    if (q.tag && !r.tags.includes(q.tag)) return false;
    if (needle) {
      const hay = normalizeSearch([r.title, r.meta ?? '', ...r.tags].join(' '));
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
  const sort = q.sort ?? 'recent';
  return [...filtered].sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title, 'ru');
    if (sort === 'duration') return b.durationSec - a.durationSec;
    return recency(b).localeCompare(recency(a));
  });
}

export function continueCandidate(recordings: Recording[]): Recording | undefined {
  return recordings
    .filter((r) => statusOf(r) === 'started' && r.lastPlayedAt)
    .sort((a, b) => b.lastPlayedAt!.localeCompare(a.lastPlayedAt!))[0];
}

interface LibraryData {
  recordings: Recording[];
  folders: Folder[];
}

interface LibraryState extends LibraryData {
  add(r: Recording): void;
  update(id: string, patch: Partial<Recording>): void;
  rename(id: string, title: string): void;
  setTags(id: string, tags: string[]): void;
  setCover(id: string, c: Cover): void;
  moveToFolder(id: string, folderId: string | null): void;
  remove(id: string): void;
  createFolder(name: string): Folder | null;
  clear(): void;
  reset(): void;
}

const initial = (): LibraryData => ({
  recordings: structuredClone(seedRecordings),
  folders: structuredClone(seedFolders),
});

export function cleanTags(tags: string[]): string[] {
  const out: string[] = [];
  for (const t of tags) {
    const v = t.trim().toLowerCase();
    if (v && !out.includes(v)) out.push(v);
  }
  return out;
}

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => {
      const patch = (id: string, p: Partial<Recording>) =>
        set({ recordings: get().recordings.map((r) => (r.id === id ? { ...r, ...p } : r)) });
      return {
        ...initial(),
        add: (r) => set({ recordings: [r, ...get().recordings] }),
        update: patch,
        rename: (id, title) => {
          const v = title.trim();
          if (v) patch(id, { title: v });
        },
        setTags: (id, tags) => patch(id, { tags: cleanTags(tags) }),
        setCover: (id, cover) => patch(id, { cover }),
        moveToFolder: (id, folderId) => patch(id, { folderId }),
        remove: (id) => set({ recordings: get().recordings.filter((r) => r.id !== id) }),
        createFolder: (name) => {
          const v = name.trim();
          if (!v) return null;
          if (get().folders.some((f) => normalizeSearch(f.name) === normalizeSearch(v))) return null;
          const folder = { id: `folder-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, name: v };
          set({ folders: [...get().folders, folder] });
          return folder;
        },
        clear: () => set({ recordings: [] }),
        reset: () => set(initial()),
      };
    },
    persistOptions<LibraryState, LibraryData>('library', initial, (s) => ({
      recordings: s.recordings,
      folders: s.folders,
    })),
  ),
);
