import { test, expect } from '@playwright/test';
import { gotoReady, noHorizontalOverflow } from './helpers';

test('long title does not overflow in full player', async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(() => window.__golos!.stores.player.getState().open('sensory-guide', { expand: true }));
  await expect(page.getByRole('button', { name: 'Свернуть' })).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBe(true);
});

test('open full player from the continue card and collapse', async ({ page }) => {
  await gotoReady(page);
  await page.getByRole('button', { name: /В метро: диалог/ }).first().click();
  await expect(page.getByRole('button', { name: 'Свернуть' })).toBeVisible();
  await page.getByRole('button', { name: 'Свернуть' }).click();
  await expect(page.getByTestId('mini-player')).toBeVisible();
});
