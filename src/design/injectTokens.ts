import { colors, colorTokenNames, fontFamilies, frameChrome, radius, typeScale, type ThemeName } from './tokens';

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

export function tokensToCss(): string {
  const themes = (Object.keys(colors) as ThemeName[]).map((theme) => {
    const vars = colorTokenNames.map((name) => `  --${kebab(name)}: ${colors[theme][name]};`).join('\n');
    return `[data-theme="${theme}"] {\n${vars}\n  color-scheme: ${theme === 'light' ? 'light' : 'dark'};\n}`;
  });

  const rootVars = [
    `--font-sans: ${fontFamilies.sans};`,
    `--font-mono: ${fontFamilies.mono};`,
    ...Object.entries(radius).map(([k, v]) => `--radius-${k}: ${v}px;`),
    ...Object.entries(frameChrome).map(([k, v]) => `--frame-${k}: ${v};`),
    ...Object.entries(typeScale).flatMap(([name, s]) => {
      const n = kebab(name);
      return [
        `--type-${n}-family: var(--font-${s.family});`,
        `--type-${n}-size: ${s.sizePx / 16}rem;`,
        `--type-${n}-weight: ${s.weight};`,
        `--type-${n}-lh: ${s.lineHeight};`,
        `--type-${n}-ls: ${s.letterSpacingEm}em;`,
      ];
    }),
  ];

  return `:root {\n  ${rootVars.join('\n  ')}\n}\n${themes.join('\n')}\n`;
}

export function injectTokens(doc: Document = document): void {
  let el = doc.getElementById('golos-tokens');
  if (!el) {
    el = doc.createElement('style');
    el.id = 'golos-tokens';
    doc.head.appendChild(el);
  }
  el.textContent = tokensToCss();
}
