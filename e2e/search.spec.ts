import { test, expect } from '@playwright/test';
import { gotoReady, noHorizontalOverflow } from './helpers';

test('search on device', async ({ page }) => {
  await gotoReady(page);
  await page.getByRole('button', { name: 'Поиск' }).click();
  await page.getByRole('searchbox').fill('колобок');
  await expect(page.getByText('Колобок')).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBe(true);
});
