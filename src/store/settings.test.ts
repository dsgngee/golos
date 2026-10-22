import { useSettings } from './settings';

beforeEach(() => useSettings.getState().reset());

test('settings defaults', () =>
  expect(useSettings.getState()).toMatchObject({ skipStep: 15, defaultSleep: 30, theme: 'light', defaultRate: 1, notifyReady: true }));

test('set changes one setting', () => {
  useSettings.getState().set('skipStep', 30);
  expect(useSettings.getState().skipStep).toBe(30);
});
