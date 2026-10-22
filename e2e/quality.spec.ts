import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
import { noHorizontalOverflow } from './helpers';
import { screensToCheck } from './screens';

test.use({ reducedMotion: 'reduce' });

const INTERACTIVE = 'button, a, [role=tab], [role=radio], [role=switch], [role=slider], [role=checkbox]';

for (const s of screensToCheck) {
  test(`quality: ${s.name}`, async ({ page }, info) => {
    test.skip(info.project.name === 'desktop', 'Prüfung gilt für iPhone-Viewports');
    await s.reach(page);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `review/screenshots/${info.project.name}/${s.name}.png` });

    expect(await noHorizontalOverflow(page), 'horizontaler Überlauf').toBe(true);

    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('button, [role=tab], [role=radio], h1, h2, h3')]
        .filter((e) => e.getClientRects().length > 0 && getComputedStyle(e).textOverflow !== 'ellipsis')
        .filter((e) => e.scrollWidth > e.clientWidth + 1)
        .map((e) => (e.textContent ?? '').trim().slice(0, 60)),
    );
    expect(clipped, 'abgeschnittener Text').toEqual([]);

    const small = await page.evaluate((sel) =>
      [...document.querySelectorAll<HTMLElement>(sel)]
        .map((e) => ({ e, r: e.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 0 && r.height > 0 && (r.width < 43.5 || r.height < 43.5))
        .map(({ e, r }) => `${Math.round(r.width)}×${Math.round(r.height)} ${e.getAttribute('aria-label') ?? (e.textContent ?? '').trim().slice(0, 30)}`),
      INTERACTIVE,
    );
    expect(small, 'Touch-Ziele unter 44 px').toEqual([]);

    // [data-decor] = rein dekorative Listennummern („01“), laut Spec 4.1 bewusst 3 : 1 (Token `decor`).
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).exclude('[data-decor]').analyze();
    expect(
      axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`),
      'axe (WCAG 2 A/AA)',
    ).toEqual([]);
  });
}
