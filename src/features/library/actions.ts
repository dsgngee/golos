import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';

/** Löscht eine Aufnahme; läuft sie gerade, wird der Player vorher geschlossen. */
export function deleteRecording(id: string) {
  if (usePlayer.getState().currentId === id) usePlayer.getState().close();
  useLibrary.getState().remove(id);
}
