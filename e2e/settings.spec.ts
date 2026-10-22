import { test, expect } from '@playwright/test';
import { gotoReady, noHorizontalOverflow } from './helpers';

test('dark theme on device', async ({ page }) => {
  await gotoReady(page);
  await page.getByRole('tab', { name: 'Профиль' }).click();
  expect(await noHorizontalOverflow(page)).toBe(true);
  await page.getByRole('radio', { name: 'Тёмная' }).click();
  await expect(page.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark');
});
