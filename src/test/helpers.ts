import type { ScreenName, TabId } from '../app/navigation';
import { useNav } from '../app/navigation';
import type { Recording } from '../data/types';
import { useLibrary } from '../store/library';

export function top(tab: TabId): ScreenName {
  const stack = useNav.getState().stacks[tab];
  return stack[stack.length - 1].name;
}

export function lib(id: string): Recording {
  const r = useLibrary.getState().recordings.find((x) => x.id === id);
  if (!r) throw new Error(`recording ${id} not found`);
  return r;
}

export function pos(id: string): number {
  return lib(id).positionSec;
}
