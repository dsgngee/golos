import { create } from 'zustand';

export interface BannerData {
  title: string;
  body?: string;
  recordingId?: string;
}

interface UiState {
  banner: BannerData | null;
  showBanner(b: BannerData): void;
  hideBanner(): void;
}

export const useUi = create<UiState>()((set) => ({
  banner: null,
  showBanner: (banner) => set({ banner }),
  hideBanner: () => set({ banner: null }),
}));
