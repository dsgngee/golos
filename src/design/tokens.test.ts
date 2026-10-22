import { colors, contrastRules } from './tokens';
import { contrastRatio } from './contrast';
import { tokensToCss } from './injectTokens';

test('contrastRatio known values', () => {
  expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 1);
  expect(contrastRatio('#6E6A62', '#F1EFEA')).toBeCloseTo(4.68, 1);
});

test.each(['light', 'dark', 'night'] as const)('%s meets all contrast rules', (theme) => {
  for (const r of contrastRules)
    expect(contrastRatio(colors[theme][r.fg], colors[theme][r.bg])).toBeGreaterThanOrEqual(r.min);
});

test('spec values kept', () => {
  expect(colors.light.accent).toBe('#E2461F');
  expect(colors.dark.accentText).toBe('#FF5B2E');
  expect(colors.dark.accentTextOnInverse).toBe('#BF360E');
});

test('tokensToCss emits every theme and token', () => {
  const css = tokensToCss();
  for (const th of ['light', 'dark', 'night']) expect(css).toContain(`[data-theme="${th}"]`);
  expect(css).toContain('--accent-text-on-inverse: #BF360E');
  expect(css).toContain("--font-mono: 'JetBrains Mono'");
});

test('light tokens also apply on bare :root before any theme is set', () => {
  expect(tokensToCss()).toMatch(/:root,\s*\[data-theme="light"\]\s*\{/);
});
