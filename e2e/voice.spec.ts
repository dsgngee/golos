import { test, expect } from '@playwright/test';
import { gotoReady, noHorizontalOverflow } from './helpers';

test('voice tab: session raises quality', async ({ page }) => {
  await gotoReady(page);
  await page.getByRole('tab', { name: 'Голос' }).click();
  await expect(page.getByText('Ваш голос · 86 %')).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBe(true);
  await page.getByRole('button', { name: /Прочитайте отрывок/ }).click();
  await page.getByRole('button', { name: 'Записать все фразы (прототип)' }).click();
  await expect(page.getByText('Голос обновлён: 89 %')).toBeVisible();
});
