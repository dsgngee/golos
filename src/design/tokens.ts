// Einzige Quelle der Design-Tokens für golos (Richtung B «Студия»).
// Werte aus der Spec, Abschnitt 4.1 und 6.7; Kontrast in tokens.test.ts geprüft.

export type ThemeName = 'light' | 'dark' | 'night';

export const colorTokenNames = [
  'bg',
  'ink',
  'muted',
  'decor',
  'line',
  'surfaceInverse',
  'onInverse',
  'mutedOnInverse',
  'trackOnInverse',
  'accent',
  'accentText',
  'accentTextOnInverse',
  'onAccent',
] as const;

export type ColorToken = (typeof colorTokenNames)[number];

export const colors: Record<ThemeName, Record<ColorToken, string>> = {
  light: {
    bg: '#F1EFEA',
    ink: '#121212',
    muted: '#6E6A62',
    decor: '#8A867D',
    line: '#DAD6CE',
    surfaceInverse: '#121212',
    onInverse: '#F1EFEA',
    mutedOnInverse: '#9A968E',
    trackOnInverse: '#3A3936',
    accent: '#E2461F',
    accentText: '#BF360E',
    accentTextOnInverse: '#E2461F',
    onAccent: '#FFFFFF',
  },
  dark: {
    bg: '#131313',
    ink: '#ECEAE4',
    muted: '#85827A',
    decor: '#66635D',
    line: '#262624',
    surfaceInverse: '#ECEAE4',
    onInverse: '#131313',
    mutedOnInverse: '#6A675F',
    trackOnInverse: '#C9C6BE',
    accent: '#E2461F',
    accentText: '#FF5B2E',
    accentTextOnInverse: '#BF360E',
    onAccent: '#FFFFFF',
  },
  night: {
    bg: '#0B0B0B',
    ink: '#BDB9B0',
    muted: '#85827A',
    decor: '#66635D',
    line: '#1F1F1F',
    surfaceInverse: '#161616',
    onInverse: '#BDB9B0',
    mutedOnInverse: '#85827A',
    trackOnInverse: '#2E2E2E',
    accent: '#B8441F',
    accentText: '#D9592F',
    accentTextOnInverse: '#D9592F',
    onAccent: '#F1EFEA',
  },
};

export const contrastRules: ReadonlyArray<{ fg: ColorToken; bg: ColorToken; min: 4.5 | 3 }> = [
  { fg: 'ink', bg: 'bg', min: 4.5 },
  { fg: 'muted', bg: 'bg', min: 4.5 },
  { fg: 'onInverse', bg: 'surfaceInverse', min: 4.5 },
  { fg: 'mutedOnInverse', bg: 'surfaceInverse', min: 4.5 },
  { fg: 'accentText', bg: 'bg', min: 4.5 },
  { fg: 'accentTextOnInverse', bg: 'surfaceInverse', min: 4.5 },
  { fg: 'decor', bg: 'bg', min: 3 },
  { fg: 'accent', bg: 'bg', min: 3 },
  { fg: 'accent', bg: 'surfaceInverse', min: 3 },
  { fg: 'onAccent', bg: 'accent', min: 3 },
];

export type TypeStyleName = 'titleXL' | 'title' | 'body' | 'meta' | 'mono' | 'label';

export interface TypeStyle {
  family: 'sans' | 'mono';
  sizePx: number;
  weight: number;
  lineHeight: number;
  letterSpacingEm: number;
}

export const typeScale: Record<TypeStyleName, TypeStyle> = {
  titleXL: { family: 'sans', sizePx: 33, weight: 800, lineHeight: 1.0, letterSpacingEm: -0.035 },
  title: { family: 'sans', sizePx: 20, weight: 600, lineHeight: 1.15, letterSpacingEm: -0.015 },
  body: { family: 'sans', sizePx: 15, weight: 400, lineHeight: 1.4, letterSpacingEm: 0 },
  meta: { family: 'sans', sizePx: 12, weight: 400, lineHeight: 1.35, letterSpacingEm: 0 },
  mono: { family: 'mono', sizePx: 11, weight: 500, lineHeight: 1.3, letterSpacingEm: 0 },
  label: { family: 'mono', sizePx: 10, weight: 500, lineHeight: 1.2, letterSpacingEm: 0.06 },
};

export const fontFamilies = {
  sans: "'Onest', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

export const radius = { card: 22, control: 16, round: 999 } as const;

// Nur für den Desktop-Präsentationsrahmen (iPhone-Gehäuse), nicht Teil des App-Designs.
export const frameChrome = { bezel: '#0A0A0A', rim: '#3A3A3C' } as const;

// Erdige Motive für „Фото“-Cover (Basis, Form) – flächig, keine Verläufe.
export const coverMotifs: ReadonlyArray<readonly [base: string, shape: string]> = [
  ['#C9B8A0', '#8C7A62'],
  ['#A7B0A0', '#5E6B5A'],
  ['#D8C3B0', '#A0705A'],
  ['#B9B4AA', '#6F6A60'],
  ['#C2A98E', '#7A5A44'],
  ['#AFA79A', '#4F4A44'],
];
