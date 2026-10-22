import { test, expect } from '@playwright/test';

test('styleguide reachable via hash', async ({ page }) => {
  await page.goto('/#/styleguide');
  await expect(page.getByRole('heading', { name: 'Styleguide golos' })).toBeVisible();
});
