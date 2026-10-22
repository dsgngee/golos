import type { Page } from '@playwright/test';
import type { ScenarioId } from '../src/app/scenarios';

export interface ScreenCheck {
  name: string;
  reach(page: Page): Promise<void>;
}

async function boot(page: Page, scenario: ScenarioId = 'ready') {
  await page.goto('/');
  await page.waitForFunction(() => !!window.__golos?.runScenario);
  await page.evaluate((s) => window.__golos!.runScenario!(s), scenario);
}

const setStep = (page: Page, step: string) =>
  page.evaluate((st) => window.__golos!.stores.voice.getState().setSetupStep(st as never), step);

const push = (page: Page, tab: string, name: string, params?: Record<string, string>) =>
  page.evaluate(
    ([t, n, p]) => {
      const nav = window.__golos!.stores.nav.getState();
      nav.switchTab(t as never);
      if (n) nav.push({ name: n as never, params: p as Record<string, string> | undefined });
    },
    [tab, name, params] as const,
  );

const openPlayer = (page: Page, id: string, expand = true) =>
  page.evaluate(([i, e]) => window.__golos!.stores.player.getState().open(i as string, { expand: e as boolean }), [id, expand] as const);

export const screensToCheck: ScreenCheck[] = [
  // Onboarding (6.1)
  { name: 'onboarding-welcome', reach: (p) => boot(p, 'reset') },
  { name: 'onboarding-expectation', reach: async (p) => { await boot(p, 'reset'); await setStep(p, 'expectation'); } },
  { name: 'onboarding-prepare', reach: async (p) => { await boot(p, 'reset'); await setStep(p, 'prepare'); } },
  { name: 'onboarding-record', reach: (p) => boot(p, 'tooQuiet') },
  { name: 'onboarding-quality', reach: async (p) => { await boot(p, 'reset'); await setStep(p, 'quality'); } },
  { name: 'onboarding-creating', reach: async (p) => { await boot(p, 'reset'); await setStep(p, 'creating'); } },
  { name: 'onboarding-sample', reach: async (p) => { await boot(p, 'reset'); await setStep(p, 'sample'); } },

  // Bibliothek (6.3, 6.4)
  { name: 'library-home', reach: (p) => boot(p) },
  { name: 'library-home-voice-missing', reach: (p) => boot(p, 'voiceMissing') },
  { name: 'library-empty', reach: (p) => boot(p, 'emptyLibrary') },
  { name: 'library-search', reach: async (p) => { await boot(p); await push(p, 'library', 'library.search'); } },
  {
    name: 'library-search-empty',
    reach: async (p) => {
      await boot(p);
      await push(p, 'library', 'library.search');
      await p.getByRole('searchbox').fill('zzzz');
    },
  },
  { name: 'library-folder', reach: async (p) => { await boot(p); await push(p, 'library', 'library.folder', { folderId: 'tales' }); } },
  {
    name: 'library-folder-empty',
    reach: async (p) => {
      await boot(p);
      const id = await p.evaluate(() => window.__golos!.stores.library.getState().createFolder('Подкасты')!.id);
      await push(p, 'library', 'library.folder', { folderId: id });
    },
  },
  { name: 'library-edit', reach: async (p) => { await boot(p); await push(p, 'library', 'library.edit', { id: 'metro' }); } },
  {
    name: 'library-actions-sheet',
    reach: async (p) => {
      await boot(p);
      await push(p, 'library', 'library.search');
      await p.getByRole('button', { name: 'Действия' }).first().click();
    },
  },
  {
    name: 'library-folder-picker',
    reach: async (p) => {
      await boot(p);
      await push(p, 'library', 'library.edit', { id: 'metro' });
      await p.getByRole('button', { name: /Папка/ }).click();
    },
  },

  // Player (6.5, 6.7)
  { name: 'player-mini', reach: async (p) => { await boot(p); await openPlayer(p, 'metro', false); } },
  { name: 'player-full', reach: async (p) => { await boot(p); await openPlayer(p, 'psychology'); } },
  {
    name: 'player-read-along',
    reach: async (p) => {
      await boot(p);
      await openPlayer(p, 'psychology');
      await p.evaluate(() => window.__golos!.stores.player.getState().setReadAlong(true));
    },
  },
  { name: 'player-tempo', reach: async (p) => { await boot(p); await openPlayer(p, 'psychology'); await p.getByRole('button', { name: /Скорость/ }).click(); } },
  { name: 'player-sleep', reach: async (p) => { await boot(p); await openPlayer(p, 'psychology'); await p.getByRole('button', { name: /Таймер/ }).click(); } },
  { name: 'player-chapters', reach: async (p) => { await boot(p); await openPlayer(p, 'psychology'); await p.getByRole('button', { name: /Главы/ }).click(); } },
  { name: 'player-long-title', reach: async (p) => { await boot(p); await openPlayer(p, 'sensory-guide'); } },
  { name: 'player-night', reach: (p) => boot(p, 'night') },

  // Vertonen (6.2)
  { name: 'create-source', reach: async (p) => { await boot(p); await push(p, 'create', ''); } },
  {
    name: 'create-pdf-sheet',
    reach: async (p) => {
      await boot(p);
      await push(p, 'create', '');
      await p.getByRole('button', { name: /Загрузить PDF/ }).click();
    },
  },
  {
    name: 'create-review',
    reach: async (p) => {
      await boot(p);
      await push(p, 'create', '');
      await p.getByRole('button', { name: /Загрузить PDF/ }).click();
      await p.getByRole('button', { name: /Психология общения\.pdf/ }).click();
    },
  },
  {
    name: 'create-options',
    reach: async (p) => {
      await boot(p);
      await push(p, 'create', '');
      await p.getByRole('button', { name: /Ссылка на статью/ }).click();
      await p.getByRole('button', { name: 'Извлечь текст' }).click();
      await p.getByRole('button', { name: 'Далее' }).click();
      await p.getByRole('switch', { name: 'Перевести перед озвучкой' }).click();
    },
  },
  {
    name: 'create-options-voice-missing',
    reach: async (p) => {
      await boot(p, 'voiceMissing');
      await push(p, 'create', '');
      await p.getByRole('button', { name: /Ссылка на статью/ }).click();
      await p.getByRole('button', { name: 'Извлечь текст' }).click();
      await p.getByRole('button', { name: 'Далее' }).click();
    },
  },
  { name: 'create-generating', reach: (p) => boot(p, 'generating') },
  { name: 'banner-ready', reach: (p) => boot(p, 'readyBanner') },

  // Stimme (6.6)
  { name: 'voice-home', reach: async (p) => { await boot(p); await push(p, 'voice', ''); } },
  { name: 'voice-home-missing', reach: async (p) => { await boot(p, 'voiceMissing'); await push(p, 'voice', ''); } },
  { name: 'voice-session-free', reach: async (p) => { await boot(p); await push(p, 'voice', 'voice.session', { id: 'story' }); } },
  { name: 'voice-session-phrases', reach: async (p) => { await boot(p); await push(p, 'voice', 'voice.session', { id: 'emotion' }); } },
  { name: 'voice-revoice', reach: async (p) => { await boot(p); await push(p, 'voice', 'voice.revoice'); } },

  // Profil (6.8, 6.9)
  { name: 'profile', reach: async (p) => { await boot(p); await push(p, 'profile', ''); } },
  {
    name: 'profile-dark-library',
    reach: async (p) => {
      await boot(p);
      await p.evaluate(() => window.__golos!.stores.settings.getState().set('theme', 'dark'));
    },
  },
  {
    name: 'styleguide',
    reach: async (p) => {
      await boot(p);
      await p.evaluate(() => {
        location.hash = '#styleguide';
      });
      await p.getByRole('heading', { name: 'Styleguide golos' }).waitFor();
    },
  },
  {
    name: 'profile-dark-player',
    reach: async (p) => {
      await boot(p);
      await p.evaluate(() => window.__golos!.stores.settings.getState().set('theme', 'dark'));
      await openPlayer(p, 'metro');
    },
  },
];
