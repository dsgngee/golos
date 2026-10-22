import { usePlayer } from '../../store/player';

/** Macht eine Aufnahme zur aktuellen, ohne den Wiedergabezustand anderer Aufnahmen zu übernehmen. */
export function ensureCurrent(id: string) {
  if (usePlayer.getState().currentId !== id) usePlayer.getState().open(id);
}

export const control = {
  toggle(id: string) {
    ensureCurrent(id);
    usePlayer.getState().toggle();
  },
  skip(id: string, delta: number) {
    ensureCurrent(id);
    usePlayer.getState().skip(delta);
  },
  seek(id: string, sec: number) {
    ensureCurrent(id);
    usePlayer.getState().seek(sec);
  },
};
