import { create } from 'zustand';

export type TabId = 'library' | 'create' | 'voice' | 'profile';

export type ScreenName =
  | 'library.home'
  | 'library.search'
  | 'library.folder'
  | 'library.edit'
  | 'create.source'
  | 'create.review'
  | 'create.options'
  | 'create.generating'
  | 'voice.home'
  | 'voice.session'
  | 'voice.revoice'
  | 'profile.home';

export interface Screen {
  name: ScreenName;
  params?: Record<string, string>;
}

export const TABS: readonly TabId[] = ['library', 'create', 'voice', 'profile'];

const roots: Record<TabId, Screen> = {
  library: { name: 'library.home' },
  create: { name: 'create.source' },
  voice: { name: 'voice.home' },
  profile: { name: 'profile.home' },
};

const initialStacks = (): Record<TabId, Screen[]> => ({
  library: [roots.library],
  create: [roots.create],
  voice: [roots.voice],
  profile: [roots.profile],
});

interface NavState {
  tab: TabId;
  stacks: Record<TabId, Screen[]>;
  switchTab(t: TabId): void;
  push(s: Screen): void;
  pop(): void;
  popToRoot(tab?: TabId): void;
  reset(): void;
}

export const useNav = create<NavState>()((set, get) => ({
  tab: 'library',
  stacks: initialStacks(),
  switchTab: (t) => (get().tab === t ? get().popToRoot(t) : set({ tab: t })),
  push: (s) => {
    const { tab, stacks } = get();
    set({ stacks: { ...stacks, [tab]: [...stacks[tab], s] } });
  },
  pop: () => {
    const { tab, stacks } = get();
    if (stacks[tab].length <= 1) return;
    set({ stacks: { ...stacks, [tab]: stacks[tab].slice(0, -1) } });
  },
  popToRoot: (t) => {
    const tab = t ?? get().tab;
    set({ stacks: { ...get().stacks, [tab]: [roots[tab]] } });
  },
  reset: () => set({ tab: 'library', stacks: initialStacks() }),
}));
