import { createJSONStorage, type StateStorage } from 'zustand/middleware';

// localStorage kann im privaten Modus oder bei gesperrten Website-Daten werfen.
export const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      /* ignorieren: Prototyp läuft ohne Persistenz weiter */
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignorieren */
    }
  },
};

export const storageKey = (store: string) => `golos-proto-v1-${store}`;

/** Persist-Optionen: Version 1; veraltete oder fremde Stände werden durch den Anfangszustand ersetzt. */
export function persistOptions<S, P = Partial<S>>(store: string, initial: () => P, partialize?: (s: S) => P) {
  return {
    name: storageKey(store),
    version: 1,
    storage: createJSONStorage<P>(() => safeStorage),
    migrate: () => initial(),
    ...(partialize ? { partialize } : {}),
  };
}
