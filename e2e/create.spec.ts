import { test, expect } from '@playwright/test';
import { gotoReady } from './helpers';

test('link → generating → banner → player', async ({ page }) => {
  test.setTimeout(60_000);
  await gotoReady(page);
  await page.getByRole('tab', { name: 'Озвучить' }).click();
  await page.getByRole('button', { name: /Ссылка на статью/ }).click();
  await page.getByRole('button', { name: 'Извлечь текст' }).click();
  await expect(page.getByText('≈ 18 мин')).toBeVisible();
  await page.getByRole('button', { name: 'Далее' }).click();
  await page.getByRole('button', { name: 'Озвучить' }).click();
  await expect(page.getByText('Озвучиваем…')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Слушать', exact: true })).toBeVisible({ timeout: 25_000 });
  await page.getByRole('button', { name: 'Слушать', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Свернуть' })).toBeVisible();
});
