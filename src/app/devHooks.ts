import { useLibrary } from '../store/library';
import { usePlayer } from '../store/player';
import { useSettings } from '../store/settings';
import { useUi } from '../store/ui';
import { useVoice } from '../store/voice';
import { useNav } from './navigation';

const stores = {
  library: useLibrary,
  settings: useSettings,
  voice: useVoice,
  player: usePlayer,
  nav: useNav,
  ui: useUi,
};

declare global {
  interface Window {
    __golos?: { stores: typeof stores; runScenario?: (id: string) => void };
  }
}

/** Nur im Dev-Build: Zugriff auf die Stores für E2E-Tests. */
export function installDevHooks() {
  if (!import.meta.env.DEV) return;
  window.__golos = { ...window.__golos, stores };
}
