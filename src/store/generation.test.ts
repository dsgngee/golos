import { draftFromLink, lib } from '../test/helpers';
import { jobDurationMs, useGeneration } from './generation';
import { useLibrary } from './library';
import { usePlayer } from './player';
import { useSettings } from './settings';
import { useUi } from './ui';

beforeEach(() => {
  useLibrary.getState().reset();
  useSettings.getState().reset();
  usePlayer.getState().reset();
  useGeneration.getState().reset();
  useUi.getState().hideBanner();
});

test('jobDurationMs clamps', () => {
  expect(jobDurationMs(100)).toBe(6000);
  expect(jobDurationMs(1080)).toBe(8640);
  expect(jobDurationMs(9000)).toBe(20000);
});

test('start → progress → banner', () => {
  const id = useGeneration.getState().start(draftFromLink());
  expect(lib(id)).toMatchObject({ generationProgress: 0, title: 'Сенсорная интеграция', durationSec: 1080, type: 'article' });
  useGeneration.getState().tick(4320);
  expect(lib(id).generationProgress).toBeCloseTo(0.5);
  useGeneration.getState().tick(5000);
  expect(lib(id).generationProgress).toBeUndefined();
  expect(useGeneration.getState().jobs).toHaveLength(0);
  expect(useUi.getState().banner).toMatchObject({ title: 'Готово', body: '«Сенсорная интеграция» можно слушать', recordingId: id });
});

test('no banner when notifications are off', () => {
  useSettings.getState().set('notifyReady', false);
  useGeneration.getState().start(draftFromLink());
  useGeneration.getState().tick(20_000);
  expect(useUi.getState().banner).toBeNull();
});

test('translation sets language and meta', () => {
  const id = useGeneration.getState().start({ ...draftFromLink(), translateTo: 'zh' });
  expect(lib(id)).toMatchObject({ language: 'zh', translatedFrom: 'ru', meta: 'Перевод с русского · Китайский' });
});

test('tags are cleaned on start', () => {
  const id = useGeneration.getState().start({ ...draftFromLink(), tags: [' Аутизм ', 'аутизм', ''] });
  expect(lib(id).tags).toEqual(['аутизм']);
});

test('revoicing the playing recording closes the player', () => {
  usePlayer.getState().open('metro');
  useGeneration.getState().revoice('metro');
  expect(usePlayer.getState().currentId).toBeNull();
  expect(lib('metro')).toMatchObject({ generationProgress: 0, positionSec: 0 });
  expect(useGeneration.getState().jobs).toHaveLength(1);
});

test('a deleted recording drops its job', () => {
  const id = useGeneration.getState().start(draftFromLink());
  useLibrary.getState().remove(id);
  useGeneration.getState().tick(1000);
  expect(useGeneration.getState().jobs).toHaveLength(0);
});
