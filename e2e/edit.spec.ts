import { test, expect } from '@playwright/test';
import { gotoReady } from './helpers';

test('row menu → edit → rename on device', async ({ page }) => {
  await gotoReady(page);
  await page.getByRole('button', { name: 'Все записи' }).click();
  await page.getByTestId('recording-row').filter({ hasText: 'Колобок' }).getByRole('button', { name: 'Действия' }).click();
  await page.getByRole('button', { name: 'Изменить' }).click();
  const name = page.getByLabel('Название');
  await name.fill('Колобок и лиса');
  await page.getByRole('button', { name: 'Готово', exact: true }).click();
  await expect(page.getByText('Колобок и лиса')).toBeVisible();
});
