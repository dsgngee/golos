import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:5175' },
  webServer: {
    command: 'npm run dev -- --port 5175 --strictPort',
    url: 'http://localhost:5175',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: 'iphone-375', use: { ...devices['iPhone 13'], viewport: { width: 375, height: 667 } } },
    { name: 'iphone-430', use: { ...devices['iPhone 13'], viewport: { width: 430, height: 932 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
    // Chromium im iPhone-Format: korrekte Darstellung variabler Schriften für Review-Screenshots
    // (Playwright-WebKit unter Windows rendert die Gewichtsachse von Onest nicht).
    {
      name: 'iphone-390-chromium',
      testMatch: /quality\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
    },
  ],
});
