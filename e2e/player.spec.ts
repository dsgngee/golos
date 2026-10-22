import { test, expect } from '@playwright/test';
import { gotoReady, noHorizontalOverflow } from './helpers';

test('long title does not overflow in full player', async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(() => window.__golos!.stores.player.getState().open('sensory-guide', { expand: true }));
  await expect(page.getByRole('button', { name: 'Свернуть' })).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBe(true);
});

test('sheets opened from the full player are on top and usable', async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(() => window.__golos!.stores.player.getState().open('psychology', { expand: true }));
  await page.getByRole('button', { name: /Скорость/ }).click();
  await page.getByRole('radio', { name: '1,5×' }).click();
  await expect(page.getByRole('radio', { name: '1,5×' })).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Главы/ }).click();
  await page.getByRole('button', { name: /Глава 3/ }).first().click();
  await expect(page.getByText('Глава 3. Вопросы, которые открывают').first()).toBeVisible();
});

test('open full player from the continue card and collapse', async ({ page }) => {
  await gotoReady(page);
  await page.getByRole('button', { name: /В метро: диалог/ }).first().click();
  await expect(page.getByRole('button', { name: 'Свернуть' })).toBeVisible();
  await page.getByRole('button', { name: 'Свернуть' }).click();
  await expect(page.getByTestId('mini-player')).toBeVisible();
});
