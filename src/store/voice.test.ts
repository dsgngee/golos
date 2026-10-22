import { useVoice } from './voice';

beforeEach(() => useVoice.getState().reset());

test('voice lifecycle', () => {
  const v = useVoice.getState();
  v.finishSetup(new Date('2026-10-22'));
  expect(useVoice.getState()).toMatchObject({ status: 'ready', quality: 86, minutes: 10 });
  v.finishSession('story');
  v.finishSession('story');
  expect(useVoice.getState()).toMatchObject({ quality: 92, minutes: 20, sessionsDone: ['story'] });
  for (let i = 0; i < 5; i++) v.finishSession('excerpt');
  expect(useVoice.getState().quality).toBe(97);
  v.completeOnboarding();
  v.deleteVoice();
  expect(useVoice.getState()).toMatchObject({ status: 'none', quality: 0, minutes: 0, onboardingDone: true });
});

test('reset is first start', () => {
  useVoice.getState().completeOnboarding();
  useVoice.getState().reset();
  expect(useVoice.getState()).toMatchObject({ onboardingDone: false, setupStep: 'welcome', status: 'none' });
});

test('startSetup from the app begins at prepare', () => {
  useVoice.getState().completeOnboarding();
  useVoice.getState().setPhraseIndex(5);
  useVoice.getState().startSetup();
  expect(useVoice.getState()).toMatchObject({ setupActive: true, setupStep: 'prepare', phraseIndex: 0 });
  useVoice.getState().completeOnboarding();
  expect(useVoice.getState().setupActive).toBe(false);
});
