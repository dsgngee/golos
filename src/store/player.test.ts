import { lib, pos } from '../test/helpers';
import { statusOf, useLibrary } from './library';
import { usePlayer } from './player';
import { useSettings } from './settings';

beforeEach(() => {
  useLibrary.getState().reset();
  useSettings.getState().reset();
  usePlayer.getState().reset();
});

test('open reads remembered position, sets lastPlayedAt', () => {
  const before = lib('metro').lastPlayedAt;
  usePlayer.getState().open('metro');
  expect(pos('metro')).toBe(761);
  expect(usePlayer.getState().currentId).toBe('metro');
  expect(lib('metro').lastPlayedAt).not.toBe(before);
});

test('skip and seek clamp', () => {
  const p = usePlayer.getState();
  p.open('metro');
  p.skip(-15);
  expect(pos('metro')).toBe(746);
  p.skip(+15);
  expect(pos('metro')).toBe(761);
  p.seek(5);
  p.skip(-15);
  expect(pos('metro')).toBe(0);
  p.seek(5000);
  expect(pos('metro')).toBe(1100);
  p.seek(-3);
  expect(pos('metro')).toBe(0);
});

test('tick advances by rate only while playing', () => {
  const p = usePlayer.getState();
  p.open('metro');
  p.tick(1000);
  expect(pos('metro')).toBe(761);
  p.play();
  p.tick(1000);
  expect(pos('metro')).toBe(762);
  p.setRate(1.5);
  p.tick(1000);
  expect(pos('metro')).toBe(763.5);
});

test('reaching the end pauses and marks finished', () => {
  const p = usePlayer.getState();
  p.open('metro');
  p.play();
  p.tick(400_000);
  expect(usePlayer.getState().isPlaying).toBe(false);
  expect(statusOf(lib('metro'))).toBe('finished');
});

test('sleep timer counts real time and stops playback', () => {
  const p = usePlayer.getState();
  p.open('psychology');
  p.play();
  p.setRate(2);
  p.setSleep(15);
  expect(usePlayer.getState().sleep.remainingMs).toBe(900_000);
  p.tick(900_000);
  expect(usePlayer.getState()).toMatchObject({ isPlaying: false, sleep: { option: 'off', remainingMs: null } });
});

test('chapterEnd pauses at next chapter start', () => {
  const p = usePlayer.getState();
  p.open('psychology');
  const ch = lib('psychology').chapters!;
  p.seek(ch[1].startSec + 10);
  p.setSleep('chapterEnd');
  p.play();
  p.tick((ch[2].startSec - ch[1].startSec) * 1000);
  expect(pos('psychology')).toBe(ch[2].startSec);
  expect(usePlayer.getState().isPlaying).toBe(false);
});

test('opening a tale turns on night mode with default sleep 30', () => {
  usePlayer.getState().open('kolobok');
  expect(usePlayer.getState()).toMatchObject({ nightMode: true, sleep: { option: 30, remainingMs: 1_800_000 } });
});

test('night mode persists across non-tale open, ends with sleep timer', () => {
  const p = usePlayer.getState();
  p.open('kolobok');
  p.open('metro');
  expect(usePlayer.getState().nightMode).toBe(true);
  p.play();
  p.tick(1_800_000);
  expect(usePlayer.getState().nightMode).toBe(false);
});

test('autoplay and expand options', () => {
  usePlayer.getState().open('metro', { expand: true, autoplay: true });
  expect(usePlayer.getState()).toMatchObject({ expanded: true, isPlaying: true });
});

test('close resets playback state', () => {
  const p = usePlayer.getState();
  p.open('metro', { expand: true });
  p.close();
  expect(usePlayer.getState()).toMatchObject({ currentId: null, isPlaying: false, expanded: false, nightMode: false });
});

test('tick with a removed recording closes the player', () => {
  const p = usePlayer.getState();
  p.open('metro');
  p.play();
  useLibrary.getState().remove('metro');
  p.tick(1000);
  expect(usePlayer.getState().currentId).toBeNull();
});
