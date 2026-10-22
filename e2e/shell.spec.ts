import { test, expect } from '@playwright/test';

test('phone viewport has no frame, desktop has frame', async ({ page }, info) => {
  await page.goto('/');
  const frame = page.getByTestId('phone-frame');
  if (info.project.name === 'desktop') await expect(frame).toBeVisible();
  else await expect(frame).toHaveCount(0);
});
