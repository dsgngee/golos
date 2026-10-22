import { seedRecordings } from '../data/seed';
import { lib } from '../test/helpers';
import { selectRecordings, statusOf, useLibrary } from './library';

beforeEach(() => useLibrary.getState().reset());

test('search ignores case and ё/е', () => {
  for (const q of ['ЕЖИК', 'ёжик', 'ежик'])
    expect(selectRecordings(seedRecordings, { search: q }).map((r) => r.id)).toContain('hedgehog');
});

test('search matches tags and meta', () =>
  expect(selectRecordings(seedRecordings, { search: 'урок 4' })[0].id).toBe('metro'));

test('filter by type and folder', () => {
  expect(selectRecordings(seedRecordings, { type: 'tale' }).every((r) => r.type === 'tale')).toBe(true);
  expect(selectRecordings(seedRecordings, { folderId: 'chinese' }).map((r) => r.id)).toContain('metro');
});

test('filter by tag', () => {
  const tagged = selectRecordings(seedRecordings, { tag: 'китайский' });
  expect(tagged.length).toBeGreaterThan(0);
  expect(tagged.every((r) => r.tags.includes('китайский'))).toBe(true);
});

test('sort by title uses Russian collation', () => {
  const titles = selectRecordings(seedRecordings, { sort: 'title' }).map((r) => r.title);
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'ru')));
});

test('sort by duration longest first', () => {
  const d = selectRecordings(seedRecordings, { sort: 'duration' }).map((r) => r.durationSec);
  expect(d).toEqual([...d].sort((a, b) => b - a));
});

test('statusOf', () => {
  const base = seedRecordings.find((r) => r.id === 'kolobok')!;
  expect(statusOf({ ...base, positionSec: 0 })).toBe('new');
  expect(statusOf({ ...base, positionSec: 10 })).toBe('started');
  expect(statusOf({ ...base, positionSec: base.durationSec })).toBe('finished');
  expect(statusOf({ ...base, generationProgress: 0.4 })).toBe('generating');
});

test('rename trims and ignores blank', () => {
  const { rename } = useLibrary.getState();
  rename('metro', '   ');
  expect(lib('metro').title).toBe('В метро: диалог');
  rename('metro', '  Метро  ');
  expect(lib('metro').title).toBe('Метро');
});

test('setTags trims, lowercases, dedupes, drops empty', () => {
  useLibrary.getState().setTags('metro', [' Китайский', 'китайский', '', 'Диалоги ']);
  expect(lib('metro').tags).toEqual(['китайский', 'диалоги']);
});

test('createFolder rejects blank and duplicate names', () => {
  expect(useLibrary.getState().createFolder('  ')).toBeNull();
  expect(useLibrary.getState().createFolder('китайский')).toBeNull();
  expect(useLibrary.getState().createFolder('Подкасты')?.name).toBe('Подкасты');
});

test('remove, moveToFolder, setCover, clear', () => {
  const s = useLibrary.getState();
  s.moveToFolder('kolobok', null);
  expect(lib('kolobok').folderId).toBeNull();
  s.setCover('kolobok', { kind: 'typo', tone: 'accent' });
  expect(lib('kolobok').cover).toEqual({ kind: 'typo', tone: 'accent' });
  s.remove('kolobok');
  expect(useLibrary.getState().recordings.some((r) => r.id === 'kolobok')).toBe(false);
  s.clear();
  expect(useLibrary.getState().recordings).toHaveLength(0);
});
