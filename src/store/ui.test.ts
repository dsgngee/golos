import { useUi } from './ui';

test('banner show/hide', () => {
  useUi.getState().showBanner({ title: 'Готово' });
  expect(useUi.getState().banner?.title).toBe('Готово');
  useUi.getState().hideBanner();
  expect(useUi.getState().banner).toBeNull();
});
