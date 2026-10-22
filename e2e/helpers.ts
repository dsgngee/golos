import { expect, type Page } from '@playwright/test';

/** Lädt die App frisch und springt in den Zustand „Stimme eingerichtet, Bibliothek mit Beispielen“. */
export async function gotoReady(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => !!window.__golos);
  await page.evaluate(() => {
    const g = window.__golos!;
    if (g.runScenario) {
      g.runScenario('ready');
      return;
    }
    const s = g.stores;
    s.library.getState().reset();
    s.player.getState().reset();
    s.nav.getState().reset();
    s.voice.setState({ onboardingDone: true, status: 'ready', quality: 86, minutes: 10 });
  });
  await expect(page.getByRole('tab', { name: 'Библиотека' })).toBeVisible();
}

export async function noHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
}
