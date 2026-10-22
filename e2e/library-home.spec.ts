import { test, expect } from '@playwright/test';
import { gotoReady, noHorizontalOverflow } from './helpers';

test('play advances time', async ({ page }) => {
  await gotoReady(page);
  await page.getByRole('button', { name: 'Воспроизвести' }).first().click();
  await expect
    .poll(async () => Number(await page.getByRole('slider').first().getAttribute('aria-valuenow')), { timeout: 5000 })
    .toBeGreaterThan(761);
});

test('no horizontal overflow on home', async ({ page }) => {
  await gotoReady(page);
  expect(await noHorizontalOverflow(page)).toBe(true);
});
