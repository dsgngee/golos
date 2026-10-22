import { seedFolders, seedRecordings } from './seed';
import { continueCandidate } from '../store/library';

test('seed has 24 unique recordings incl. pinned ones', () => {
  expect(seedRecordings).toHaveLength(24);
  expect(new Set(seedRecordings.map((r) => r.id)).size).toBe(24);
  expect(seedRecordings.find((r) => r.id === 'metro')).toMatchObject({ durationSec: 1100, positionSec: 761 });
  for (const id of ['psychology', 'sensory', 'sensory-guide', 'kolobok', 'teremok', 'hedgehog', 'thesis', 'shop', 'migration'])
    expect(seedRecordings.some((r) => r.id === id)).toBe(true);
});

test('continue candidate is metro', () => expect(continueCandidate(seedRecordings)?.id).toBe('metro'));

test('every recording has text with ≥3 sentences', () =>
  seedRecordings.forEach((r) => expect(r.text.split(/[.!?…]\s/).length).toBeGreaterThanOrEqual(3)));

test('folders referenced by recordings exist', () => {
  const ids = new Set(seedFolders.map((f) => f.id));
  seedRecordings.forEach((r) => r.folderId === null || expect(ids.has(r.folderId)).toBe(true));
});

test('book has 8 chapters starting at 0', () => {
  const book = seedRecordings.find((r) => r.id === 'psychology')!;
  expect(book.chapters).toHaveLength(8);
  expect(book.chapters![0].startSec).toBe(0);
});
