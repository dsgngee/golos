import { safeStorage } from './persist';
import { useLibrary } from './library';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

test('safeStorage survives throwing localStorage', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked');
  });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('blocked');
  });
  expect(safeStorage.getItem('x')).toBeNull();
  expect(() => safeStorage.setItem('x', '1')).not.toThrow();
  expect(() => safeStorage.removeItem('x')).not.toThrow();
});

test('stale persisted version falls back to seed', async () => {
  localStorage.setItem('golos-proto-v1-library', JSON.stringify({ state: { recordings: [] }, version: 0 }));
  await useLibrary.persist.rehydrate();
  expect(useLibrary.getState().recordings).toHaveLength(24);
});
