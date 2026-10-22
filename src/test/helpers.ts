import type { ScreenName, TabId } from '../app/navigation';
import { useNav } from '../app/navigation';
import type { Recording } from '../data/types';
import { sampleLink } from '../data/samples';
import type { Draft } from '../features/create/draft';

export function draftFromLink(): Draft {
  return {
    source: 'link',
    type: 'article',
    text: sampleLink.text,
    simulatedWords: sampleLink.simulatedWords,
    title: sampleLink.title,
    folderId: null,
    tags: [],
    language: 'ru',
    translateTo: null,
    style: 'normal',
  };
}
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
