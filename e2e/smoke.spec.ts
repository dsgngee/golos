import { test, expect } from '@playwright/test';

test('page is Russian and titled', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page).toHaveTitle('golos');
});
