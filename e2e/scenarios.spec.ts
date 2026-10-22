import { test, expect } from '@playwright/test';
import { gotoReady } from './helpers';

test('scenario buttons work on device', async ({ page }) => {
  await gotoReady(page);
  await page.getByRole('tab', { name: 'Профиль' }).click();
  await page.getByRole('button', { name: 'Ночной режим' }).first().click();
  await expect(page.getByTestId('night-player')).toBeVisible();
});

test('reset returns to the welcome screen', async ({ page }) => {
  await gotoReady(page);
  await page.getByRole('tab', { name: 'Профиль' }).click();
  await page.getByRole('button', { name: 'Сбросить всё' }).first().click();
  await expect(page.getByText('Слушайте любой текст своим голосом')).toBeVisible();
});
