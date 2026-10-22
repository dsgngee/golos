import { test, expect } from '@playwright/test';

test('first visit starts onboarding and reaches library', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByText('Слушайте любой текст своим голосом')).toBeVisible();
  await page.getByRole('button', { name: 'Начать' }).click();
  await page.getByRole('button', { name: 'Понятно' }).click();
  await page.getByRole('button', { name: 'Начать запись' }).click();
  await page.getByRole('button', { name: 'Записать все фразы (прототип)' }).click();
  await page.getByRole('button', { name: 'Создать голос' }).click();
  await expect(page.getByText('Послушайте себя')).toBeVisible({ timeout: 10_000 });
  await page.getByRole('button', { name: 'В библиотеку' }).click();
  await expect(page.getByRole('tab', { name: 'Библиотека' })).toBeVisible();
});
