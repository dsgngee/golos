import { useGeneration } from '../store/generation';
import { useLibrary } from '../store/library';
import { usePlayer } from '../store/player';
import { useSettings } from '../store/settings';
import { useUi } from '../store/ui';
import { useVoice } from '../store/voice';
import { top } from '../test/helpers';
import { useNav } from './navigation';
import { runScenario } from './scenarios';

test('reset returns to first start', () => {
  runScenario('ready');
  useSettings.getState().set('theme', 'dark');
  runScenario('reset');
  expect(useVoice.getState()).toMatchObject({ onboardingDone: false, setupStep: 'welcome', status: 'none' });
  expect(useLibrary.getState().recordings).toHaveLength(24);
  expect(useSettings.getState().theme).toBe('light');
});

test('ready skips onboarding with a set-up voice', () => {
  runScenario('ready');
  expect(useVoice.getState()).toMatchObject({ onboardingDone: true, status: 'ready', quality: 86 });
  expect(useNav.getState().tab).toBe('library');
});

test('voiceMissing', () => {
  runScenario('voiceMissing');
  expect(useVoice.getState()).toMatchObject({ onboardingDone: true, status: 'none' });
});

test('emptyLibrary', () => {
  usePlayer.getState().open('metro');
  runScenario('emptyLibrary');
  expect(useLibrary.getState().recordings).toHaveLength(0);
  expect(usePlayer.getState().currentId).toBeNull();
});

test('generating', () => {
  runScenario('generating');
  expect(useGeneration.getState().jobs).toHaveLength(1);
  expect(useNav.getState().tab).toBe('create');
  expect(top('create')).toBe('create.generating');
});

test('tooQuiet', () => {
  runScenario('tooQuiet');
  expect(useVoice.getState()).toMatchObject({ setupActive: true, setupStep: 'record', phraseIndex: 2, forceTooQuiet: true });
});

test('readyBanner', () => {
  runScenario('readyBanner');
  expect(useUi.getState().banner).toMatchObject({ title: 'Готово', recordingId: 'sensory' });
});

test('night', () => {
  runScenario('night');
  expect(usePlayer.getState()).toMatchObject({ currentId: 'kolobok', nightMode: true, expanded: true });
});
