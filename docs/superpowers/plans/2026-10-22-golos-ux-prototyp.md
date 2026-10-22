# golos UX/UI-Prototyp – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ein durchklickbarer, russischsprachiger Wegwerf-Web-Prototyp der golos-App im Look B «Студия», der sich auf dem iPhone wie eine native App anfühlt und alle Abläufe 6.1–6.9 der Spec simuliert.

**Architecture:**
- **Vite + React SPA**, ohne Backend. Der gesamte Zustand liegt in kleinen Zustand-Stores (Bibliothek, Einstellungen, Stimme, Player, Generierung, UI, Navigation) mit Beispieldaten. Teile davon werden über einen ausfallsicheren `localStorage`-Wrapper gespeichert.
- **Navigation** über einen eigenen Stack pro Tab (iOS-Muster) statt eines URL-Routers. Der Hash unterscheidet nur App (`#/`) und Styleguide (`#/styleguide`).
- **Design-Tokens** sind eine TypeScript-Quelle, die zur Laufzeit als CSS-Variablen pro Theme (`light`/`dark`/`night`) injiziert wird. Komponenten nutzen ausschließlich diese Variablen.

**Tech Stack:**
- Node 24, Vite, React, TypeScript, Zustand
- CSS Modules
- Vitest + Testing Library (jsdom)
- Playwright (WebKit für iPhone-Viewports, Chromium für Desktop) + `@axe-core/playwright`

**Spec:** `docs/superpowers/specs/2026-10-21-golos-ux-prototyp-design.md` (freigegeben). Executors lesen Spec **und** Plan.

## Global Constraints

- **Oberfläche ausschließlich Russisch.** Alle UI-Texte stehen in `src/content/ru.ts` (Objekt `t`), keine kyrillischen Literale in `src/app`, `src/ui`, `src/features`.
  - Ausnahme: Beispieldaten in `src/data/*`.
  - Wird durch `src/test/conventions.test.ts` geprüft.
- **Anrede „вы“.** Kurze, natürliche UX-Texte, nicht übersetzt klingend.
- **Typografisch korrekt:**
  - Russische Pluralformen über `plural()`
  - Dezimalkomma („1,25×“, „1,2 ГБ“)
  - Minuszeichen U+2212 in Restzeiten („−05:39“)
  - Guillemets «…» für Titel in Texten
- **Farben nur über CSS-Variablen aus `src/design/tokens.ts`.** Keine Hex-Werte in `*.module.css` (geprüft durch `conventions.test.ts`).
- **Akzent-Regel:** genau ein Akzent (`--accent` und seine Text-Stufen) – nur für Play, Fortschritt, kleine Status-Labels und primäre Signale. Nie dekorativ, keine Verläufe, keine Glas-Effekte.
- **Schriften:** nur `Onest` (400/500/600/700/800) und `JetBrains Mono` (400/500) über Google Fonts.
  - Onest 800, ≈33 px, Laufweite −0,035 em für Screen-Titel
  - JetBrains Mono für Timecodes, Dauern, Zähler, Nummern und Großbuchstaben-Labels (+0,06 em)
- **Radien:** 22 px Karten/Dock, 16 px Buttons/Felder, voll rund für Play/Avatare.
- **Kontrast:** Text ≥ 4,5 : 1; große Schrift, Symbole und Bedienelemente ≥ 3 : 1. Gilt für alle drei Themes.
- **Touch-Ziele** ≥ 44 × 44 px.
- **Bedienhilfen:** russische `aria-label`s an allen Icon-Buttons; `prefers-reduced-motion` schaltet Animationen ab.
- **iOS-Gefühl:**
  - Feedback über `:active`, nicht über Hover
  - keine Textauswahl auf Bedienelementen
  - `overscroll-behavior: none` auf der Seite; Screens scrollen intern
  - Zurück nur per Pfeil – **keine eigene Wisch-Geste vom Rand**
- **Viewports:** funktioniert von 375 bis 430 px Breite im normalen Safari-Tab.
  - Bis 500 px randlos mit Safe Areas.
  - Darüber: iPhone-Rahmen 390 × 844 zentriert, daneben das Prototyp-Panel.
- **Kein Ton.** Wiedergabe, Aufnahme und Vertonung sind simuliert.
- **Kein** Abo, kein Telegram, kein Backend.
- **Hosting-unabhängig:** Vite `base: './'`, Hash-Routing, statischer Build.
- **Referenz-Entwürfe (maßgeblich für den Look)** – vor jeder UI-Aufgabe im Browser öffnen:
  - `.superpowers/brainstorm/3225-1792574096/content/studiya-player-v2.html` → rechter Entwurf
  - Für Dunkel nur als Farbreferenz: `.superpowers/brainstorm/3164-1792573334/content/studiya-varianten.html` → B2
- **Styleguide bleibt synchron:** Jede Aufgabe, die eine neue wiederverwendbare Komponente oder einen neuen Zustand einführt, ergänzt sie in derselben Aufgabe auf der Styleguide-Seite (ab Task 9).
- **Skills:**
  - `ui-ux-pro-max` für iOS-/Mobile-Regeln bei UI-Aufgaben
  - `avoiding-ai-website-slop` (nach Task 1 unter `.claude/skills/`) für Copy- und Anti-Slop-Prüfung in Task 19
  - `artifact-design` vor dem Veröffentlichen in Task 20
- **Commits:** nach jeder Aufgabe auf Branch `prototyp`. Commit-Messages enden mit `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

### Abbildung Spec-Tokens → Code-Tokens (Task 2)

| Spec (4.1/6.7) | Code-Token |
|---|---|
| `bg`, `ink`, `line` | gleichnamig |
| `surface-inverse`, `on-inverse`, `muted-on-inverse`, `track-on-inverse` | `surfaceInverse`, `onInverse`, `mutedOnInverse`, `trackOnInverse` |
| `muted` | `muted` |
| `decor` | `decor` |
| `accent` | `accent` (Flächen, Symbole, Fortschritt) |
| `accent-text-on-light` `#BF360E` | `light.accentText`, `dark.accentTextOnInverse` |
| `accent-on-dark` `#FF5B2E` | `dark.accentText` |
| `night-*` | Theme `night` mit allen Tokens |

## Review Focus

1. **Lange russische Titel** (z. B. „Сенсорная интеграция при аутизме: практическое руководство для родителей“) bei 375 px: umbrechen bzw. nach 2 Zeilen mit „…“ kürzen, nie horizontal überlaufen.
   - Test: Task 4 Seed, Task 10 E2E, Task 19 Overflow-Suite.
2. **Suche mit ё/е und Groß-/Kleinschreibung:** „ЕЖИК“, „ёжик“ und „ежик“ finden alle „Ёжик и звёзды“.
   - Test: Task 4.
3. **Leere oder nur aus Leerzeichen bestehende Eingaben** (Text, Titel, Tags, Name) werden nicht übernommen; „Далее“, „Озвучить“ und „Готово“ sind dann deaktiviert, Tags werden getrimmt und dedupliziert.
   - Tests: Tasks 4, 12, 14, 17.
4. **`localStorage` gesperrt oder veraltet** (privater Modus, wirft Exception, alte Version): Die App startet trotzdem mit Beispieldaten.
   - Test: Task 4.
5. **Löschen oder Neu-Vertonen der gerade laufenden Aufnahme:** Der Player schließt sauber, der Mini-Player verschwindet, nichts stürzt ab. Spulen über Anfang/Ende hinaus wird begrenzt.
   - Tests: Tasks 5, 12, 14.

---

## File Structure

```
golos/
  index.html · package.json · vite.config.ts · tsconfig.json · playwright.config.ts · .gitignore
  .claude/skills/avoiding-ai-website-slop/     (kopiert)
  e2e/            helpers.ts · smoke.spec.ts · <flow>.spec.ts · quality.spec.ts
  review/         screenshots/ · anti-slop.md                       (Task 19)
  src/
    main.tsx
    test/         setup.ts · conventions.test.ts
    content/      ru.ts                       – alle UI-Texte (t), Typ-Labels
    design/       tokens.ts · contrast.ts · injectTokens.ts · global.css
    i18n/         format.ts                   – Plural, Zeiten, Zahlen, Suche-Normalisierung
    data/         types.ts · seed.ts · samples.ts · phrases.ts · sessions.ts
    store/        persist.ts · library.ts · settings.ts · voice.ts · player.ts · generation.ts · ui.ts
    app/          App.tsx · MainShell.tsx · PhoneFrame.tsx · navigation.ts · screens.tsx
                  useIsPhone.ts · useResolvedTheme.ts · scenarios.ts · devHooks.ts · PrototypePanel.tsx
    ui/           icons.tsx · TabBar · NavBar · Sheet · ActionSheet · Banner · ProgressLine · SkipButton
                  PlayButton · Button · RecordingRow · Chip · SegmentedControl · Toggle · Cover
                  EmptyState · PrototypeHint · TextField           (je .tsx + .module.css)
    features/
      styleguide/ Styleguide.tsx
      library/    LibraryHome · ContinueCard · VoiceMissingRow · SearchScreen · FolderScreen
                  SortSheet · RecordingActions · EditScreen · CoverPicker · TagEditor · FolderPicker · useLongPress.ts
      player/     MiniPlayer · FullPlayer · NightPlayer · TempoSheet · SleepSheet · ChaptersSheet
                  ReadAlong · sentences.ts · usePlaybackClock.ts
      create/     draft.ts · SourceScreen · ReviewScreen · OptionsScreen · GeneratingScreen · useGenerationClock.ts
      onboarding/ OnboardingFlow · Welcome · Expectation · Prepare · QualityCheck · Creating · FirstSample
      voice/      Recorder · LevelMeter · VoiceHome · VoiceSessionScreen · RevoiceScreen
      profile/    ProfileScreen · PrototypeMenu
```

Tests liegen neben der Datei als `*.test.ts(x)`; E2E-Tests in `e2e/`.

---

### Task 1: Projektgerüst, Werkzeuge, Konventionstests

**Files:**
- Create: `.gitignore`, `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `playwright.config.ts`, `src/main.tsx`, `src/app/App.tsx`, `src/content/ru.ts`, `src/test/setup.ts`, `src/test/conventions.test.ts`, `src/app/App.test.tsx`, `e2e/smoke.spec.ts`
- Copy: `C:/Users/drugo/Documents/projects/BRU Facility/.claude/skills/avoiding-ai-website-slop/` → `.claude/skills/avoiding-ai-website-slop/`

**Interfaces:**
- Produces:
  - `export const t = { appTitle: 'golos — прототип', … } as const` in `src/content/ru.ts`. Wird in jeder Aufgabe um ihre Texte erweitert.
  - npm-Skripte: `dev`, `build` (`tsc -b && vite build`), `test` (`vitest run`), `e2e` (`playwright test`)

- [ ] **Step 1: Git initialisieren und Doku committen**
  `git init -b main`. `.gitignore` enthält:
  `node_modules/`, `dist/`, `.superpowers/`, `.playwright-mcp/`, `test-results/`, `playwright-report/`
  `git add .gitignore docs && git commit -m "docs: Design-Spec und Umsetzungsplan"`, dann `git switch -c prototyp`.

- [ ] **Step 2: Abhängigkeiten installieren**
  Run: `npm init -y`, dann
  - `npm i react react-dom zustand`
  - `npm i -D vite @vitejs/plugin-react typescript @types/react @types/react-dom vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @axe-core/playwright`
  - `npx playwright install webkit chromium`

  Expected: Installation ohne Fehler.

- [ ] **Step 3: Konfiguration schreiben**
  - `vite.config.ts`:
    - `base: './'`
    - Plugin react
    - `test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', globals: true }`
  - `src/test/setup.ts` importiert `@testing-library/jest-dom/vitest`.
  - `tsconfig.json`:
    - `strict: true`, `jsx: react-jsx`, `moduleResolution: bundler`
    - `types: ["vitest/globals"]`
  - `index.html`:
    - `<html lang="ru">`, `<title>golos — прототип</title>`
    - `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
    - `apple-mobile-web-app-capable=yes`, `apple-mobile-web-app-status-bar-style=black-translucent`
    - Google-Fonts-Link für `Onest:wght@400;500;600;700;800` und `JetBrains+Mono:wght@400;500` mit `display=swap`
  - `playwright.config.ts`:
    - `webServer: npm run dev -- --port 5175 --strictPort`, `baseURL: http://localhost:5175`
    - Projekte:
      - `iphone-375`: `{...devices['iPhone 13'], viewport: {width: 375, height: 667}}` (WebKit)
      - `iphone-430`: `{...devices['iPhone 13'], viewport: {width: 430, height: 932}}` (WebKit)
      - `desktop`: Chromium 1280 × 900

- [ ] **Step 4: Failing Tests schreiben**

```tsx
// src/app/App.test.tsx
test('renders app root', () => {
  render(<App />);
  expect(screen.getByTestId('app-root')).toBeInTheDocument();
});
```
```ts
// src/test/conventions.test.ts – liest Dateien rekursiv mit node:fs (readdirSync + readFileSync)
test('no Cyrillic literals outside content and data', () => {
  // alle .ts/.tsx unter src/app, src/ui, src/features ohne *.test.*
  expect(filesWithCyrillic).toEqual([]);
});
test('no hex colors in CSS modules', () => {
  // alle *.module.css unter src/
  expect(cssFilesWithHex).toEqual([]);
});
```
```ts
// e2e/smoke.spec.ts
test('page is Russian and titled', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page).toHaveTitle('golos — прототип');
});
```

- [ ] **Step 5: Run – fails**
  Run: `npx vitest run src/app/App.test.tsx`
  Expected: FAIL (App fehlt).

- [ ] **Step 6: Minimal implementieren**
  - `App()` rendert `<div data-testid="app-root" />`.
  - `main.tsx` mountet `App` in `#root`.

- [ ] **Step 7: Run – passes**
  Run: `npm test && npx playwright test e2e/smoke.spec.ts`
  Expected: alle PASS (in drei Projekten).

- [ ] **Step 8: Skill kopieren und committen**
  `cp -r "../BRU Facility/.claude/skills/avoiding-ai-website-slop" .claude/skills/`
  `git add -A && git commit -m "chore: Projektgerüst, Tests, Anti-Slop-Skill"`

---

### Task 2: Design-Tokens, Themes, Kontrast

**Files:**
- Create: `src/design/tokens.ts`, `src/design/contrast.ts`, `src/design/injectTokens.ts`, `src/design/global.css`
- Tests: `src/design/tokens.test.ts`
- Modify: `src/main.tsx` (Tokens injizieren, `global.css` importieren)

**Interfaces:**
- Produces:
```ts
export type ThemeName = 'light' | 'dark' | 'night';
export const colorTokenNames = ['bg','ink','muted','decor','line','surfaceInverse','onInverse',
  'mutedOnInverse','trackOnInverse','accent','accentText','accentTextOnInverse','onAccent'] as const;
export type ColorToken = (typeof colorTokenNames)[number];
export const colors: Record<ThemeName, Record<ColorToken, string>>;
export const contrastRules: ReadonlyArray<{ fg: ColorToken; bg: ColorToken; min: 4.5 | 3 }>;
export const typeScale: Record<'titleXL'|'title'|'body'|'meta'|'mono'|'label',
  { family: 'sans'|'mono'; sizePx: number; weight: number; lineHeight: number; letterSpacingEm: number }>;
export const radius: { card: 22; control: 16; round: 999 };
export const coverMotifs: ReadonlyArray<readonly [base: string, shape: string]>; // 6 erdige Paare für „Фото“-Cover (Task 7):
// ['#C9B8A0','#8C7A62'] ['#A7B0A0','#5E6B5A'] ['#D8C3B0','#A0705A'] ['#B9B4AA','#6F6A60'] ['#C2A98E','#7A5A44'] ['#AFA79A','#4F4A44']
export function contrastRatio(fg: string, bg: string): number;        // contrast.ts
export function tokensToCss(): string;                                 // injectTokens.ts
export function injectTokens(doc?: Document): void;                    // <style id="golos-tokens">
```
  - CSS-Variablen: `--<kebab-token>` je Theme-Selektor `[data-theme="light|dark|night"]`.
  - Zusätzlich auf `:root`: `--font-sans`, `--font-mono`, `--radius-card|control|round`, `--type-<name>-size|weight|lh|ls`.

Werte (aus Spec, Kontrast vorab verifiziert):

| Token | light | dark | night |
|---|---|---|---|
| bg | #F1EFEA | #131313 | #0B0B0B |
| ink | #121212 | #ECEAE4 | #BDB9B0 |
| muted | #6E6A62 | #85827A | #85827A |
| decor | #8A867D | #66635D | #66635D |
| line | #DAD6CE | #262624 | #1F1F1F |
| surfaceInverse | #121212 | #ECEAE4 | #161616 |
| onInverse | #F1EFEA | #131313 | #BDB9B0 |
| mutedOnInverse | #9A968E | #6A675F | #85827A |
| trackOnInverse | #3A3936 | #C9C6BE | #2E2E2E |
| accent | #E2461F | #E2461F | #B8441F |
| accentText | #BF360E | #FF5B2E | #D9592F |
| accentTextOnInverse | #E2461F | #BF360E | #D9592F |
| onAccent | #FFFFFF | #FFFFFF | #F1EFEA |

`contrastRules`:
- 4,5 : 1 – ink/bg, muted/bg, onInverse/surfaceInverse, mutedOnInverse/surfaceInverse, accentText/bg, accentTextOnInverse/surfaceInverse
- 3 : 1 – decor/bg, accent/bg, accent/surfaceInverse, onAccent/accent

Typo-Skala:

| Stil | Werte |
|---|---|
| titleXL | sans 33/800/1.0/−0.035 |
| title | sans 20/600/1.15/−0.015 |
| body | sans 15/400/1.4/0 |
| meta | sans 12/400/1.35/0 |
| mono | mono 11/500/1.3/0 |
| label | mono 10/500/1.2/0.06 |

- [ ] **Step 1: Failing Tests schreiben**

```ts
test('contrastRatio known values', () => {
  expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 1);
  expect(contrastRatio('#6E6A62', '#F1EFEA')).toBeCloseTo(4.68, 1);
});
test.each(['light','dark','night'] as const)('%s meets all contrast rules', (theme) => {
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
  for (const th of ['light','dark','night']) expect(css).toContain(`[data-theme="${th}"]`);
  expect(css).toContain('--accent-text-on-inverse: #BF360E');
  expect(css).toContain("--font-mono: 'JetBrains Mono'");
});
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/design`
  Expected: FAIL (Module fehlen).

- [ ] **Step 3: Implementieren**
  - Relative Luminanz nach WCAG 2.x.
  - `global.css`:
    - Box-Sizing-Reset, `html,body{height:100%;overscroll-behavior:none;background:var(--bg)}`
    - `-webkit-tap-highlight-color: transparent`
    - `button,[role=button],[role=tab]{user-select:none;-webkit-user-select:none}`
    - `@media (prefers-reduced-motion: reduce)` setzt Animations- und Transition-Dauern auf 0.01 ms
  - `main.tsx` ruft `injectTokens()` vor dem Render.

- [ ] **Step 4: Run – passes**
  Run: `npx vitest run src/design`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Design-Tokens für hell, dunkel und Nacht mit Kontrastprüfung"`

---

### Task 3: Russische Formatierung

**Files:**
- Create: `src/i18n/format.ts`
- Test: `src/i18n/format.test.ts`

**Interfaces:**
- Produces:
```ts
export type PluralForms = readonly [one: string, few: string, many: string];
export const FORMS: Record<'recording' | 'minute' | 'second' | 'word' | 'chapter', PluralForms>;
// ['запись','записи','записей'] · ['минута','минуты','минут'] · ['секунда','секунды','секунд']
// ['слово','слова','слов'] · ['глава','главы','глав']
export function plural(n: number, forms: PluralForms): string;
export function countLabel(n: number, forms: PluralForms): string;   // "24 записи"
export function formatClock(sec: number): string;                    // mm:ss oder h:mm:ss
export function formatRemaining(sec: number): string;                // "−05:39" (U+2212)
export function formatDurationHuman(sec: number): string;            // "4 ч 12 мин" / "18 мин"
export function formatEstimate(sec: number): string;                 // "≈ 18 мин"
export function formatRate(rate: number): string;                    // "1,25×"
export function formatDay(date: Date, now: Date): string;            // "сегодня" / "вчера" / "21 октября"
export function normalizeSearch(s: string): string;                  // lower, ё→е, trim, Leerraum zusammenfassen
```

- [ ] **Step 1: Failing Tests schreiben**

```ts
test.each([[0,'записей'],[1,'запись'],[2,'записи'],[5,'записей'],[11,'записей'],[12,'записей'],
  [14,'записей'],[21,'запись'],[22,'записи'],[25,'записей'],[111,'записей']])('plural %i', (n, f) =>
  expect(plural(n, FORMS.recording)).toBe(f));
test('countLabel', () => expect(countLabel(24, FORMS.recording)).toBe('24 записи'));
test('formatClock', () => {
  expect(formatClock(761)).toBe('12:41');  expect(formatClock(1100)).toBe('18:20');
  expect(formatClock(432)).toBe('07:12');  expect(formatClock(15125)).toBe('4:12:05');
  expect(formatClock(59.9)).toBe('00:59'); expect(formatClock(-3)).toBe('00:00');
});
test('formatRemaining', () => expect(formatRemaining(339)).toBe('\u221205:39'));
test('formatDurationHuman', () => {
  expect(formatDurationHuman(15125)).toBe('4 ч 12 мин'); expect(formatDurationHuman(1120)).toBe('18 мин');
  expect(formatDurationHuman(30)).toBe('1 мин');         expect(formatDurationHuman(3600)).toBe('1 ч');
});
test('formatEstimate', () => expect(formatEstimate(1080)).toBe('≈ 18 мин'));
test('formatRate', () => {
  expect([0.75,1,1.25,1.5,2].map(formatRate)).toEqual(['0,75×','1×','1,25×','1,5×','2×']);
});
test('formatDay', () => {
  const now = new Date('2026-10-22T12:00:00');
  expect(formatDay(new Date('2026-10-22T08:00:00'), now)).toBe('сегодня');
  expect(formatDay(new Date('2026-10-21T08:00:00'), now)).toBe('вчера');
  expect(formatDay(new Date('2026-10-05T08:00:00'), now)).toBe('5 октября');
});
test('normalizeSearch', () => expect(normalizeSearch('  ЁЖИК   и звёзды ')).toBe('ежик и звезды'));
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/i18n`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**
  - Plural-Regel: Endungen 11–14 → `many`; sonst Endung 1 → `one`, Endung 2–4 → `few`, sonst `many`.
  - `formatDurationHuman`: Minuten abgerundet, mindestens 1.
  - `formatDay`: `Intl.DateTimeFormat('ru-RU', {day: 'numeric', month: 'long'})`.

- [ ] **Step 4: Run – passes**
  Run: `npx vitest run src/i18n`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: russische Plural-, Zeit- und Zahlformate"`

---

### Task 4: Datenmodell, Beispielbibliothek, Bibliotheks-Store, Persistenz

**Files:**
- Create: `src/data/types.ts`, `src/data/seed.ts`, `src/store/persist.ts`, `src/store/library.ts`, `src/test/helpers.ts`
- Tests: `src/data/seed.test.ts`, `src/store/library.test.ts`, `src/store/persist.test.ts`

**Interfaces:**
- Produces (`types.ts`):
```ts
export type RecordingType = 'book' | 'article' | 'language' | 'tale' | 'study';
export type ReadingStyle = 'normal' | 'expressive' | 'calm';
export type LanguageCode = 'ru' | 'en' | 'zh' | 'es' | 'de';
export type Rate = 0.75 | 1 | 1.25 | 1.5 | 2;
export const RATES: readonly Rate[];
export type SleepOption = 'off' | 15 | 30 | 45 | 60 | 'chapterEnd';
export interface Chapter { title: string; startSec: number }
export type Cover = { kind: 'typo'; tone: 'ink' | 'paper' | 'accent'; glyph?: string }
                  | { kind: 'photo'; preset: 1 | 2 | 3 | 4 | 5 | 6 };
export interface Folder { id: string; name: string }
export interface Recording {
  id: string; title: string; type: RecordingType; meta?: string;
  durationSec: number; positionSec: number; generationProgress?: number; // 0..1 nur während Vertonung
  folderId: string | null; tags: string[]; cover: Cover;
  language: LanguageCode; translatedFrom?: LanguageCode; style: ReadingStyle;
  createdAt: string; lastPlayedAt?: string; chapters?: Chapter[]; text: string;
}
```
- Produces (`library.ts`):
```ts
export type RecordingStatus = 'new' | 'started' | 'finished' | 'generating';
export function statusOf(r: Recording): RecordingStatus;
export interface LibraryQuery { search?: string; type?: RecordingType | 'all'; folderId?: string;
  tag?: string; sort?: 'recent' | 'title' | 'duration' }
export function selectRecordings(recordings: Recording[], q: LibraryQuery): Recording[];
export function continueCandidate(recordings: Recording[]): Recording | undefined;
export const useLibrary: UseBoundStore<{ recordings: Recording[]; folders: Folder[];
  add(r: Recording): void; update(id: string, patch: Partial<Recording>): void;
  rename(id: string, title: string): void; setTags(id: string, tags: string[]): void;
  setCover(id: string, c: Cover): void; moveToFolder(id: string, folderId: string | null): void;
  remove(id: string): void; createFolder(name: string): Folder | null; clear(): void; reset(): void }>;
```
- Produces (`persist.ts`):
  - `export const safeStorage: StateStorage` (jede Operation in try/catch, Fehler → `null` bzw. no-op)
  - `export function persistOptions<T>(name: string, initial: () => T)` → Zustand-Persist-Optionen mit `version: 1`, `storage: createJSONStorage(() => safeStorage)`, `migrate: () => initial()`
  - Schlüssel: `golos-proto-v1-<store>`
- Produces (`src/test/helpers.ts`, für alle späteren Unit-Tests):
  - `lib(id: string): Recording` – aktuelle Aufnahme aus `useLibrary`
  - `pos(id: string): number` – deren `positionSec`
  - Task 6 ergänzt `top(tab: TabId): ScreenName`.

Beispieldaten (`seed.ts`):
- **Ordner:**
  `chinese` „Китайский“ · `psychology` „Психология“ · `tales` „Сказки на ночь“ · `study` „Учёба“ · `work` „Работа“
- **Genau 24 Aufnahmen**, darunter (id · Titel · Typ · Meta · Dauer · Position):
  - `metro` · В метро: диалог · language · „Китайский язык · урок 4“ · 1100 · 761
    - zh, translatedFrom ru, Ordner `chinese`, Cover-Glyph „中“, `lastPlayedAt` = jüngstes Datum
  - `psychology` · Психология общения · book · – · 15125 · 2710
    - 8 Kapitel, Ordner `psychology`
  - `sensory` · Сенсорная интеграция при аутизме · article · – · 1120 · 0
  - `sensory-guide` · Сенсорная интеграция при аутизме: практическое руководство для родителей · article · 2400 · 0 (Review Focus 1)
  - `kolobok` · Колобок · tale · 432 · 0, style calm, Ordner `tales`
  - `teremok` · Теремок · tale · 510 · 0, style calm, Ordner `tales`
  - `hedgehog` · Ёжик и звёзды · tale · 380 · 0 (fiktiv; Review Focus 2)
  - `thesis` · Доклад к защите курсовой · study · 540 · 540 (gehört)
  - `shop` · В магазине · language · „Китайский язык · урок 2“
  - `migration` · В миграционной службе · language · „Китайский язык · урок 5“
  - Rest: realistische, **fiktive** russische Titel ohne reale Autoren, über alle Typen verteilt
- Jede Aufnahme hat `text` mit ≥ 3 Sätzen (Basis für Mitlesen).

- [ ] **Step 1: Failing Tests schreiben**

```ts
// seed.test.ts
test('seed has 24 unique recordings incl. pinned ones', () => {
  expect(seedRecordings).toHaveLength(24);
  expect(new Set(seedRecordings.map(r => r.id)).size).toBe(24);
  expect(seedRecordings.find(r => r.id === 'metro')).toMatchObject({ durationSec: 1100, positionSec: 761 });
});
test('continue candidate is metro', () => expect(continueCandidate(seedRecordings)?.id).toBe('metro'));
test('every recording has text with ≥3 sentences', () =>
  seedRecordings.forEach(r => expect(r.text.split(/[.!?…]\s/).length).toBeGreaterThanOrEqual(3)));

// library.test.ts  (beforeEach: useLibrary.getState().reset())
test('search ignores case and ё/е', () => {
  for (const q of ['ЕЖИК', 'ёжик', 'ежик'])
    expect(selectRecordings(seedRecordings, { search: q }).map(r => r.id)).toContain('hedgehog');
});
test('search matches tags and meta', () =>
  expect(selectRecordings(seedRecordings, { search: 'урок 4' })[0].id).toBe('metro'));
test('filter by type and folder', () => {
  expect(selectRecordings(seedRecordings, { type: 'tale' }).every(r => r.type === 'tale')).toBe(true);
  expect(selectRecordings(seedRecordings, { folderId: 'chinese' }).map(r => r.id)).toContain('metro');
});
test('sort by title uses Russian collation', () => {
  const ids = selectRecordings(seedRecordings, { sort: 'title' }).map(r => r.title);
  expect(ids).toEqual([...ids].sort((a, b) => a.localeCompare(b, 'ru')));
});
test('sort by duration longest first', () => {
  const d = selectRecordings(seedRecordings, { sort: 'duration' }).map(r => r.durationSec);
  expect(d).toEqual([...d].sort((a, b) => b - a));
});
test('statusOf', () => {
  const base = seedRecordings.find(r => r.id === 'kolobok')!;
  expect(statusOf({ ...base, positionSec: 0 })).toBe('new');
  expect(statusOf({ ...base, positionSec: 10 })).toBe('started');
  expect(statusOf({ ...base, positionSec: base.durationSec })).toBe('finished');
  expect(statusOf({ ...base, generationProgress: 0.4 })).toBe('generating');
});
test('rename trims and ignores blank', () => {
  const { rename } = useLibrary.getState();
  rename('metro', '   '); expect(lib('metro').title).toBe('В метро: диалог');
  rename('metro', '  Метро  '); expect(lib('metro').title).toBe('Метро');
});
test('setTags trims, lowercases, dedupes, drops empty', () => {
  useLibrary.getState().setTags('metro', [' Китайский', 'китайский', '', 'Диалоги ']);
  expect(lib('metro').tags).toEqual(['китайский', 'диалоги']);
});
test('createFolder rejects blank and duplicate names', () => {
  expect(useLibrary.getState().createFolder('  ')).toBeNull();
  expect(useLibrary.getState().createFolder('китайский')).toBeNull();
  expect(useLibrary.getState().createFolder('Подкасты')?.name).toBe('Подкасты');
});

// persist.test.ts
test('safeStorage survives throwing localStorage', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  expect(safeStorage.getItem('x')).toBeNull();
});
test('stale persisted version falls back to seed', async () => {
  localStorage.setItem('golos-proto-v1-library', JSON.stringify({ state: { recordings: [] }, version: 0 }));
  await useLibrary.persist.rehydrate();
  expect(useLibrary.getState().recordings).toHaveLength(24);
});
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/data src/store`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**
  - `useLibrary` mit `persist(…, persistOptions('library', initial))`.
  - Suche über `normalizeSearch` auf Titel, Meta und Tags.
  - `'recent'` sortiert nach `lastPlayedAt ?? createdAt` absteigend.
  - `continueCandidate`: Status `started`, jüngstes `lastPlayedAt`.

- [ ] **Step 4: Run – passes**
  Run: `npx vitest run src/data src/store`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Datenmodell, Beispielbibliothek und Bibliotheks-Store"`

---

### Task 5: Stores für Einstellungen, Stimme und Player-Simulation

**Files:**
- Create: `src/store/settings.ts`, `src/store/voice.ts`, `src/store/player.ts`
- Tests: `src/store/settings.test.ts`, `src/store/voice.test.ts`, `src/store/player.test.ts`

**Interfaces:**
- Consumes: `useLibrary`, `Rate`, `SleepOption`, `Recording` (Task 4)
- Produces:
```ts
// settings.ts – persistiert
export type ThemeSetting = 'light' | 'dark' | 'system';
export type SkipStep = 10 | 15 | 30;
export interface SettingsData { name: string; theme: ThemeSetting; defaultRate: Rate; skipStep: SkipStep;
  defaultSleep: SleepOption; notifyReady: boolean }
export const defaultSettings: SettingsData; // { name:'Алексей', theme:'light', defaultRate:1, skipStep:15, defaultSleep:30, notifyReady:true }
export const useSettings: { …SettingsData; set<K extends keyof SettingsData>(k: K, v: SettingsData[K]): void; reset(): void };

// voice.ts – persistiert
export type SetupStep = 'welcome' | 'expectation' | 'prepare' | 'record' | 'quality' | 'creating' | 'sample';
export type SessionId = 'story' | 'excerpt' | 'emotion';
export const useVoice: {
  onboardingDone: boolean; setupActive: boolean; status: 'none' | 'ready'; quality: number; minutes: number;
  updatedAt: string | null; sessionsDone: SessionId[]; setupStep: SetupStep; phraseIndex: number; forceTooQuiet: boolean;
  setSetupStep(s: SetupStep): void; setPhraseIndex(i: number): void; setForceTooQuiet(b: boolean): void;
  startSetup(): void;            // setupActive=true, setupStep='prepare', phraseIndex=0
  completeOnboarding(): void;    // onboardingDone=true, setupActive=false
  finishSetup(now?: Date): void; // status 'ready', quality 86, minutes 10, updatedAt
  finishSession(id: SessionId, now?: Date): void; // quality min(97,q+3), minutes+5, sessionsDone ∪ id
  deleteVoice(): void;           // status 'none', quality 0, minutes 0, sessionsDone [], updatedAt null
  reset(): void };               // Erststart: onboardingDone=false, setupStep='welcome'

// player.ts – persistiert nur currentId, rate
export const usePlayer: {
  currentId: string | null; isPlaying: boolean; rate: Rate; expanded: boolean; nightMode: boolean; readAlong: boolean;
  sleep: { option: SleepOption; remainingMs: number | null };
  open(id: string, opts?: { expand?: boolean; autoplay?: boolean }): void; close(): void;
  play(): void; pause(): void; toggle(): void; seek(sec: number): void; skip(deltaSec: number): void;
  setRate(r: Rate): void; setSleep(o: SleepOption): void; setExpanded(b: boolean): void;
  setNightMode(b: boolean): void; setReadAlong(b: boolean): void; tick(ms: number): void; reset(): void };
```
  Die Position lebt in `Recording.positionSec`. Der Player schreibt sie über `useLibrary.update` zurück, `open` setzt `lastPlayedAt`.

- [ ] **Step 1: Failing Tests schreiben** (`beforeEach`: alle drei Stores + `useLibrary` zurücksetzen)

```ts
test('open reads remembered position, sets lastPlayedAt', () => {
  usePlayer.getState().open('metro'); expect(pos('metro')).toBe(761); expect(lib('metro').lastPlayedAt).toBeDefined();
});
test('skip and seek clamp', () => {
  const p = usePlayer.getState(); p.open('metro');
  p.skip(-15); expect(pos('metro')).toBe(746);
  p.skip(+15); expect(pos('metro')).toBe(761);
  p.seek(5); p.skip(-15); expect(pos('metro')).toBe(0);
  p.seek(5000); expect(pos('metro')).toBe(1100);
});
test('tick advances by rate only while playing', () => {
  const p = usePlayer.getState(); p.open('metro'); p.tick(1000); expect(pos('metro')).toBe(761);
  p.play(); p.tick(1000); expect(pos('metro')).toBe(762);
  p.setRate(1.5); p.tick(1000); expect(pos('metro')).toBe(763.5);
});
test('reaching the end pauses and marks finished', () => {
  const p = usePlayer.getState(); p.open('metro'); p.play(); p.tick(400_000);
  expect(usePlayer.getState().isPlaying).toBe(false); expect(statusOf(lib('metro'))).toBe('finished');
});
test('sleep timer counts real time and stops playback', () => {
  const p = usePlayer.getState(); p.open('psychology'); p.play(); p.setRate(2); p.setSleep(15);
  expect(usePlayer.getState().sleep.remainingMs).toBe(900_000);
  p.tick(900_000);
  expect(usePlayer.getState()).toMatchObject({ isPlaying: false, sleep: { option: 'off', remainingMs: null } });
});
test('chapterEnd pauses at next chapter start', () => {
  const p = usePlayer.getState(); p.open('psychology'); const ch = lib('psychology').chapters!;
  p.seek(ch[1].startSec + 10); p.setSleep('chapterEnd'); p.play(); p.tick((ch[2].startSec - ch[1].startSec) * 1000);
  expect(pos('psychology')).toBe(ch[2].startSec); expect(usePlayer.getState().isPlaying).toBe(false);
});
test('opening a tale turns on night mode with default sleep 30', () => {
  usePlayer.getState().open('kolobok');
  expect(usePlayer.getState()).toMatchObject({ nightMode: true, sleep: { option: 30, remainingMs: 1_800_000 } });
});
test('night mode persists across non-tale open, ends with sleep timer', () => {
  const p = usePlayer.getState(); p.open('kolobok'); p.open('metro');
  expect(usePlayer.getState().nightMode).toBe(true);
  p.play(); p.tick(1_800_000); expect(usePlayer.getState().nightMode).toBe(false);
});
test('close resets playback state', () => {
  const p = usePlayer.getState(); p.open('metro', { expand: true }); p.close();
  expect(usePlayer.getState()).toMatchObject({ currentId: null, isPlaying: false, expanded: false, nightMode: false });
});
test('voice lifecycle', () => {
  const v = useVoice.getState(); v.finishSetup(new Date('2026-10-22'));
  expect(useVoice.getState()).toMatchObject({ status: 'ready', quality: 86, minutes: 10 });
  v.finishSession('story'); v.finishSession('story');
  expect(useVoice.getState()).toMatchObject({ quality: 92, minutes: 20, sessionsDone: ['story'] });
  for (let i = 0; i < 5; i++) v.finishSession('excerpt'); expect(useVoice.getState().quality).toBe(97);
  v.completeOnboarding(); v.deleteVoice();
  expect(useVoice.getState()).toMatchObject({ status: 'none', quality: 0, minutes: 0, onboardingDone: true });
});
test('settings defaults', () => expect(useSettings.getState()).toMatchObject({ skipStep: 15, defaultSleep: 30, theme: 'light' }));
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/store`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**
  - `tick(ms)` verringert `sleep.remainingMs` um `ms`, unabhängig vom Tempo.
  - Ablauf des Sleep-Timers: `pause()`, `option='off'`, `nightMode=false`.
  - `open` einer Aufnahme vom Typ `tale`: `nightMode=true`; ist `sleep.option==='off'`, wird `setSleep(useSettings.defaultSleep)` gesetzt.

- [ ] **Step 4: Run – passes**
  Run: `npx vitest run src/store`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Stores für Einstellungen, Stimme und Player-Simulation"`

---

### Task 6: App-Shell, Navigation, Theme, Sheets, Banner

**Files:**
- Create:
  - `src/app/navigation.ts`, `src/store/ui.ts`, `src/app/useIsPhone.ts`, `src/app/useResolvedTheme.ts`
  - `src/app/PhoneFrame.tsx`, `src/app/MainShell.tsx`, `src/app/screens.tsx`
  - `src/ui/TabBar.tsx`, `src/ui/NavBar.tsx`, `src/ui/Sheet.tsx`, `src/ui/ActionSheet.tsx`, `src/ui/Banner.tsx`, `src/ui/icons.tsx` (je mit `.module.css`)
- Modify: `src/app/App.tsx`, `src/content/ru.ts`
- Tests: `src/app/navigation.test.ts`, `src/store/ui.test.ts`, `src/ui/TabBar.test.tsx`, `src/ui/Sheet.test.tsx`, `e2e/shell.spec.ts`

**Interfaces:**
- Consumes: `useSettings` (Theme), `useVoice` (onboardingDone/setupActive)
- Produces:
```ts
export type TabId = 'library' | 'create' | 'voice' | 'profile';
export type ScreenName = 'library.home' | 'library.search' | 'library.folder' | 'library.edit'
  | 'create.source' | 'create.review' | 'create.options' | 'create.generating'
  | 'voice.home' | 'voice.session' | 'voice.revoice' | 'profile.home';
export interface Screen { name: ScreenName; params?: Record<string, string> }
export const useNav: { tab: TabId; stacks: Record<TabId, Screen[]>; switchTab(t: TabId): void;
  push(s: Screen): void; pop(): void; popToRoot(tab?: TabId): void; reset(): void };
export const screens: Record<ScreenName, React.ComponentType<{ params?: Record<string, string> }>>;
// Bis die Feature-Aufgaben sie ersetzen: Platzhalter mit data-testid="placeholder", die den Screen-Namen zeigen
export interface BannerData { title: string; body?: string; recordingId?: string }
export const useUi: { banner: BannerData | null; showBanner(b: BannerData): void; hideBanner(): void };
export function top(tab: TabId): ScreenName;  // in src/test/helpers.ts
export function useIsPhone(): boolean;                  // matchMedia('(max-width: 500px)')
export function useResolvedTheme(): 'light' | 'dark';   // settings.theme, 'system' via prefers-color-scheme
// UI-Primitive
<Sheet open onClose title? children />                  // role="dialog" aria-modal, Escape/Backdrop schließen, Griff
<ActionSheet open onClose title? message? actions={[{ label, onSelect, destructive? }]} />  // + „Отмена“
<NavBar title? onBack? right? />                        // Zurück-Pfeil aria-label „Назад“
<TabBar />                                              // role="tablist", schwebendes Dock
export const Icon: Record<IconName, (p: { size?: number }) => JSX.Element>;
// IconName: library | plus | mic | user | search | more | back | chevronDown | moon | timer | chapters
//           | text | check | close | folder | tag | play | pause
```
- **Verhalten:**
  - `switchTab` auf den aktiven Tab → `popToRoot`.
  - `pop` auf der Wurzel → no-op.
  - Push-Animation: Slide von rechts, 280 ms ease-out; Sheets: Slide von unten.
  - Banner blendet sich nach 4000 ms aus; Tippen öffnet `usePlayer.open(recordingId, { expand: true })`.
- **App-Routing:**
  - `location.hash === '#/styleguide'` → Styleguide-Platzhalter (Task 9)
  - sonst `!voice.onboardingDone || voice.setupActive` → Onboarding-Platzhalter (Task 15)
  - sonst `MainShell` (aktiver Stack + TabBar + Banner)
  - Wurzel-`div` trägt `data-theme={useResolvedTheme()}`.
- **PhoneFrame:**
  - Phone: randlos, `padding: env(safe-area-inset-*)`.
  - Desktop: Rahmen 390 × 844, Radius 54, simulierte Statusleiste „9:41“ und Dynamic Island, `data-testid="phone-frame"`, Slot rechts für `PrototypePanel` (Task 18).
- **Texte (`t.tabs`):**
  - `library: 'Библиотека'`, `create: 'Озвучить'`, `voice: 'Голос'`, `profile: 'Профиль'`
  - `t.common`: `back: 'Назад'`, `cancel: 'Отмена'`, `done: 'Готово'`, `close: 'Закрыть'`

- [ ] **Step 1: Failing Tests schreiben**

```ts
test('push/pop and pop at root is no-op', () => {
  const n = useNav.getState(); n.push({ name: 'library.search' });
  expect(top('library')).toBe('library.search'); n.pop(); n.pop(); expect(top('library')).toBe('library.home');
});
test('switching to the active tab pops to root', () => {
  const n = useNav.getState(); n.push({ name: 'library.search' }); n.switchTab('library');
  expect(top('library')).toBe('library.home');
});
test('stacks are kept per tab', () => {
  const n = useNav.getState(); n.push({ name: 'library.search' }); n.switchTab('voice'); n.switchTab('library');
  expect(top('library')).toBe('library.search');
});
test('banner show/hide', () => { useUi.getState().showBanner({ title: 'Готово' });
  expect(useUi.getState().banner?.title).toBe('Готово'); useUi.getState().hideBanner(); expect(useUi.getState().banner).toBeNull(); });
test('TabBar renders four Russian tabs and switches', async () => {
  render(<TabBar />);
  expect(screen.getAllByRole('tab').map(t => t.textContent)).toEqual(['Библиотека', 'Озвучить', 'Голос', 'Профиль']);
  await userEvent.click(screen.getByRole('tab', { name: 'Голос' }));
  expect(screen.getByRole('tab', { name: 'Голос' })).toHaveAttribute('aria-selected', 'true');
});
test('Sheet closes on Escape and is modal', async () => {
  const onClose = vi.fn(); render(<Sheet open onClose={onClose}>x</Sheet>);
  expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  await userEvent.keyboard('{Escape}'); expect(onClose).toHaveBeenCalled();
});
```
```ts
// e2e/shell.spec.ts
test('phone viewport has no frame, desktop has frame', async ({ page }, info) => {
  await page.goto('/');
  const frame = page.getByTestId('phone-frame');
  info.project.name === 'desktop' ? await expect(frame).toBeVisible() : await expect(frame).toHaveCount(0);
});
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/app src/ui src/store/ui.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**
  - Wie oben beschrieben.
  - Screens scrollen intern (`overflow-y: auto`).
  - Das Dock liegt über dem Inhalt; der Inhalt erhält unten Abstand in Dock-Höhe plus Safe Area.

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test e2e/shell.spec.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: App-Shell mit Tab-Navigation, Sheets, Banner und Theme"`

---

### Task 7: UI-Bausteine

**Files:**
- Create (je `.tsx` + `.module.css` + Test, wo genannt):
  - `src/ui/ProgressLine` (Test), `src/ui/SkipButton` (Test), `src/ui/PlayButton` (Test), `src/ui/Button`
  - `src/ui/RecordingRow` (Test), `src/ui/Chip`, `src/ui/SegmentedControl` (Test), `src/ui/Toggle` (Test)
  - `src/ui/Cover` (Test), `src/ui/EmptyState`, `src/ui/TextField`, `src/ui/PrototypeHint`
- Modify: `src/content/ru.ts`

**Interfaces:**
- Consumes: `formatClock`, `plural`, `FORMS` (Task 3), `Recording`, `statusOf` (Task 4), `Icon` (Task 6)
- Produces:
```tsx
<ProgressLine valueSec max onSeek={(sec) => void} tone?: 'onInverse' | 'onBg' />
//   role="slider", aria-valuenow/min/max, aria-valuetext "12:41 из 18:20"; ←/→ ±5 s; Pointer setzt Position
//   2 px Linie, gespielt in --accent, 12 px Punkt mit Halo; Trefferfläche 44 px hoch
<SkipButton direction: 'back' | 'forward' step: number onClick />
//   Kreispfeil-Symbol mit Zahl; aria-label "Назад на 15 секунд" / "Вперёд на 30 секунд"
<PlayButton playing onToggle size?: 'l' | 'm' />              // aria-label "Воспроизвести" / "Пауза"; Fläche --accent, Symbol --on-accent
<Button variant: 'outline' | 'filled' | 'plain' | 'destructive' disabled? icon? onClick>…</Button>
<RecordingRow recording index? onPress onMore />
//   data-testid="recording-row"; Mono-Nummer "01" in --decor, Titel max. 2 Zeilen + "…", Typ-Label, Mono-Dauer (formatClock)
//   Zustand: started → dünne Fortschrittslinie, finished → "Прослушано", generating → "Озвучивается… 42 %"
//   "…"-Knopf aria-label "Действия"
<Chip selected? onClick>…</Chip>
<SegmentedControl options={[{ value, label }]} value onChange ariaLabel />  // role="radiogroup", Pfeiltasten
<Toggle checked onChange label />                             // role="switch" aria-checked
<Cover cover title size: 's' | 'm' | 'l' />                    // typo: Tonfläche + glyph ?? erster Buchstabe groß
//   tone: ink → --surface-inverse/--on-inverse, paper → --line/--ink, accent → --accent/--on-accent
//   photo: Motiv coverMotifs[preset-1] (Task 2) als Inline-Style – flächige Formen, keine Verläufe
<EmptyState title body? action?={{ label, onClick }} />
<TextField label value onChange placeholder? multiline? />
<PrototypeHint onClick>…</PrototypeHint>                        // gestrichelt umrandet: nur Prototyp-Abkürzungen
```
- Typ-Labels in `ru.ts`:
  - `typeLabel`: `book 'Книга'`, `article 'Статья'`, `language 'Язык'`, `tale 'Сказка'`, `study 'Учёба'`
  - `typeFilterLabel`: `all 'Все'`, `book 'Книги'`, `article 'Статьи'`, `language 'Языки'`, `tale 'Сказки'`, `study 'Учёба'`

- [ ] **Step 1: Failing Tests schreiben**

```tsx
test('ProgressLine exposes slider semantics and keyboard seek', async () => {
  const onSeek = vi.fn(); render(<ProgressLine valueSec={761} max={1100} onSeek={onSeek} />);
  const s = screen.getByRole('slider');
  expect(s).toHaveAttribute('aria-valuetext', '12:41 из 18:20');
  s.focus(); await userEvent.keyboard('{ArrowRight}'); expect(onSeek).toHaveBeenCalledWith(766);
});
test('ProgressLine pointer maps x to seconds', () => {
  // getBoundingClientRect → {left:0,width:200}; pointerdown clientX 100 → onSeek(550)
});
test('SkipButton labels', () => {
  render(<><SkipButton direction="back" step={15} onClick={() => {}} /><SkipButton direction="forward" step={30} onClick={() => {}} /></>);
  expect(screen.getByRole('button', { name: 'Назад на 15 секунд' })).toHaveTextContent('15');
  expect(screen.getByRole('button', { name: 'Вперёд на 30 секунд' })).toBeInTheDocument();
});
test('PlayButton toggles label', () => {
  const { rerender } = render(<PlayButton playing={false} onToggle={() => {}} />);
  expect(screen.getByRole('button', { name: 'Воспроизвести' })).toBeInTheDocument();
  rerender(<PlayButton playing onToggle={() => {}} />); expect(screen.getByRole('button', { name: 'Пауза' })).toBeInTheDocument();
});
test('RecordingRow shows number, duration and states', () => {
  render(<RecordingRow recording={kolobok} index={1} onPress={() => {}} onMore={() => {}} />);
  expect(screen.getByText('01')).toBeInTheDocument(); expect(screen.getByText('07:12')).toBeInTheDocument();
  // generationProgress 0.42 → 'Озвучивается… 42 %'; positionSec === durationSec → 'Прослушано'
});
test('SegmentedControl is a radiogroup', async () => { /* Pfeil rechts wählt nächste Option, onChange */ });
test('Toggle is a switch', async () => { /* Klick → onChange(true), aria-checked */ });
test('Cover uses glyph or first letter', () => {
  render(<Cover cover={{ kind: 'typo', tone: 'ink', glyph: '中' }} title="В метро" size="m" />);
  expect(screen.getByText('中')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/ui`
  Expected: FAIL.

- [ ] **Step 3: Implementieren** – genau wie in den Referenz-Entwürfen
  - Kreispfeil-SVG wie im rechten Entwurf von `studiya-player-v2.html`.
  - Alle interaktiven Elemente mindestens 44 × 44 px; `:active` dunkelt um eine Stufe ab bzw. skaliert auf 0,97.

- [ ] **Step 4: Run – passes**
  Run: `npx vitest run src/ui`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: UI-Bausteine im Stil B «Студия»"`

---

### Task 8: Bibliothek – Start, Weiterhören-Karte, Mini-Player

**Files:**
- Create:
  - `src/features/library/LibraryHome.tsx`, `ContinueCard.tsx`, `VoiceMissingRow.tsx` (+ `.module.css`)
  - `src/features/player/MiniPlayer.tsx`, `src/features/player/usePlaybackClock.ts`
  - `src/app/devHooks.ts`, `e2e/helpers.ts`
- Modify: `src/app/screens.tsx` (`library.home`), `src/app/MainShell.tsx` (MiniPlayer über dem Dock, Clock einhängen), `src/content/ru.ts`
- Tests: `src/features/library/LibraryHome.test.tsx`, `src/features/player/MiniPlayer.test.tsx`, `e2e/library-home.spec.ts`

**Interfaces:**
- Consumes: `useLibrary`, `continueCandidate`, `selectRecordings`, `usePlayer`, `useSettings.skipStep`, `useVoice.status`, `useNav`, UI-Bausteine
- Produces:
  - `usePlaybackClock()` – `setInterval` alle 250 ms → `usePlayer.getState().tick(250)`, nur solange `isPlaying`
  - `<MiniPlayer />` – sichtbar, wenn `currentId && !expanded`; `data-testid="mini-player"`
  - `window.__golos = { stores: { library, settings, voice, player, nav, ui } }` (nur `import.meta.env.DEV`, typisiert per `declare global`)
  - `e2e/helpers.ts`: `gotoReady(page)`

**Aufbau `LibraryHome` (wie Referenz):**
- Titel „Библиотека“ + Mono-Zähler (`countLabel(n, FORMS.recording)`) + Such-Icon (aria „Поиск“ → `push library.search`).
- Bei `voice.status === 'none'`: `VoiceMissingRow` „Голос ещё не настроен · Настроить“ → `voice.startSetup()`.
- `ContinueCard` auf `surfaceInverse`:
  - Label „ПРОДОЛЖИТЬ“ (`accentTextOnInverse`), Titel, Meta
  - `ProgressLine`, Zeiten `formatClock` / `formatRemaining`
  - `SkipButton` ± `skipStep`, `PlayButton`
  - Tippen auf die Kartenfläche → `open(id, { expand: true })`
- Button „Озвучить текст +“ → `switchTab('create')`.
- Abschnitt „Недавние“: die 5 jüngsten Einträge ohne den Weiterhören-Eintrag, darunter Link „Все записи“ → `push library.search`.
  - Zeile antippen → `open(id, { autoplay: true })`.
- **Leer** (0 Aufnahmen): `EmptyState` mit
  - Titel „Здесь появятся ваши записи“
  - Text „Вставьте текст, загрузите PDF или ссылку — и слушайте своим голосом.“
  - Aktion „Озвучить текст“

**MiniPlayer:** Cover s, Titel (1 Zeile, „…“), `PlayButton` m, Haarlinie mit Fortschritt; Tippen → `setExpanded(true)`.

- [ ] **Step 1: Failing Tests schreiben**

```tsx
test('home shows count and continue card with times', () => {
  render(<LibraryHome />);
  expect(screen.getByText('24 записи')).toBeInTheDocument();
  expect(screen.getByText('В метро: диалог')).toBeInTheDocument();
  expect(screen.getByText('12:41')).toBeInTheDocument(); expect(screen.getByText('\u221205:39')).toBeInTheDocument();
});
test('skip back uses settings step', async () => {
  render(<LibraryHome />); await userEvent.click(screen.getByRole('button', { name: 'Назад на 15 секунд' }));
  expect(screen.getByText('12:26')).toBeInTheDocument();
});
test('empty library shows empty state', () => {
  useLibrary.getState().clear(); render(<LibraryHome />);
  expect(screen.getByText('Здесь появятся ваши записи')).toBeInTheDocument();
});
test('missing voice hint', () => { useVoice.setState({ status: 'none' }); render(<LibraryHome />);
  expect(screen.getByText('Голос ещё не настроен')).toBeInTheDocument(); });
test('mini player appears after opening and expands on tap', async () => {
  render(<MiniPlayer />); expect(screen.queryByTestId('mini-player')).toBeNull();
  act(() => usePlayer.getState().open('kolobok')); await userEvent.click(screen.getByTestId('mini-player'));
  expect(usePlayer.getState().expanded).toBe(true);
});
```
```ts
// e2e/library-home.spec.ts  (Helper gotoReady(page): Seite laden, window.__golos.runScenario('ready') – bis Task 18 über useVoice.setState im Dev-Hook)
test('play advances time', async ({ page }) => {
  await gotoReady(page); await page.getByRole('button', { name: 'Воспроизвести' }).first().click();
  await expect.poll(async () => Number(await page.getByRole('slider').first().getAttribute('aria-valuenow'))).toBeGreaterThan(761);
});
test('no horizontal overflow on home', async ({ page }) => {
  await gotoReady(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
```
  Teil dieses Tasks: `src/app/devHooks.ts` legt in `import.meta.env.DEV` `window.__golos = { stores }` an. Task 18 ergänzt `runScenario`. Bis dahin setzt `gotoReady` per `stores.voice.setState({ onboardingDone: true, status: 'ready' })`.

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/features && npx playwright test e2e/library-home.spec.ts`
  Expected: FAIL.

- [ ] **Step 3: Implementieren** – Look exakt nach Referenz `studiya-player-v2.html` (rechts)

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test e2e/library-home.spec.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Bibliothek-Start, Weiterhören-Karte und Mini-Player"`

---

### Task 9: Styleguide-Seite

**Files:**
- Create: `src/features/styleguide/Styleguide.tsx` (+ `.module.css`), Test `Styleguide.test.tsx`, `e2e/styleguide.spec.ts`
- Modify: `src/app/App.tsx` (Route `#/styleguide`)

**Interfaces:**
- Consumes: `colors`, `contrastRules`, `contrastRatio`, `typeScale`, `radius` (Task 2), alle UI-Bausteine (Task 7), `ContinueCard` (Task 8)
- Produces: Route `#/styleguide`. Später hinzukommende Komponenten werden hier ergänzt (Global Constraint).

**Inhalt** (Beschriftungen **Deutsch** für Designer/Entwickler, Beispielinhalte russisch):
- Überschrift „Styleguide golos“.
- **Farben** je Theme `light`/`dark`/`night`: Swatch, Token-Name, Hex, `data-testid="swatch"`.
- **Kontrast:** Tabelle aller `contrastRules` mit Verhältnis (Dezimalkomma) und ✓.
- **Typografie:** alle sechs Stile mit Beispieltext.
- **Formen:** Radien.
- **Komponenten:** jede aus Task 7 + `ContinueCard` mit allen Zuständen.
  - z. B. RecordingRow neu/angefangen/gehört/wird vertont; Button disabled; PlayButton an/aus
  - jeweils einmal in `data-theme="light"` und einmal in `data-theme="dark"`

- [ ] **Step 1: Failing Tests schreiben**

```tsx
test('lists every color token for all three themes', () => {
  render(<Styleguide />); expect(screen.getAllByTestId('swatch')).toHaveLength(39);
});
test('shows every contrast rule per theme', () => {
  render(<Styleguide />); expect(screen.getAllByTestId('contrast-row')).toHaveLength(30);
});
```
```ts
test('styleguide reachable via hash', async ({ page }) => {
  await page.goto('/#/styleguide'); await expect(page.getByRole('heading', { name: 'Styleguide golos' })).toBeVisible();
});
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/features/styleguide`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test e2e/styleguide.spec.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Styleguide-Seite mit Tokens, Kontrasten und Komponenten"`

---

### Task 10: Vollbild-Player

**Files:**
- Create:
  - `src/features/player/FullPlayer.tsx`, `TempoSheet.tsx`, `SleepSheet.tsx`, `ChaptersSheet.tsx`, `ReadAlong.tsx`, `sentences.ts` (+ `.module.css`)
- Modify: `src/app/MainShell.tsx` (FullPlayer als Overlay bei `expanded && !nightMode`), Styleguide, `ru.ts`
- Tests: `sentences.test.ts`, `FullPlayer.test.tsx`, `e2e/player.spec.ts`

**Interfaces:**
- Consumes: `usePlayer`, `useLibrary`, `useSettings.skipStep`, `formatRate`, UI-Bausteine, `Sheet`
- Produces:
```ts
export function splitSentences(text: string): string[];                       // trennt nach . ! ? … + Leerraum
export function currentSentenceIndex(posSec: number, durSec: number, count: number): number; // floor(pos/dur*count), begrenzt auf count-1
```

**Aufbau:**
- Oben: Griff + `chevronDown` (aria „Свернуть“).
- Cover l, Titel (max. 2 Zeilen), Meta, aktuelles Kapitel (falls vorhanden).
- `ProgressLine`, Zeiten, Steuerung `SkipButton` · `PlayButton l` · `SkipButton`.
- Zweite Reihe (Icon + Label):
  - **Скорость** (zeigt `formatRate`) → `TempoSheet` mit `SegmentedControl` über `RATES`
  - **Таймер** (aktiv: Restzeit `formatClock`) → `SleepSheet`
    - Optionen „Выкл“, „15 мин“, „30 мин“, „45 мин“, „60 мин“, „До конца главы“
    - die letzte nur bei Kapiteln
  - **Главы** (nur bei Kapiteln) → `ChaptersSheet` (Titel + `formatClock(startSec)`; Tippen = seek)
  - **Текст** → `ReadAlong` (Sätze, aktueller hervorgehoben, scrollt mit)
  - **Ночной режим** (Mond) → `setNightMode(true)`

- [ ] **Step 1: Failing Tests schreiben**

```ts
test('splitSentences', () => expect(splitSentences('Привет. Как дела? Отлично… Да!')).toEqual(['Привет.', 'Как дела?', 'Отлично…', 'Да!']));
test('currentSentenceIndex', () => { expect(currentSentenceIndex(0, 100, 4)).toBe(0);
  expect(currentSentenceIndex(60, 100, 4)).toBe(2); expect(currentSentenceIndex(100, 100, 4)).toBe(3); });
```
```tsx
// openExpanded(id): testlokal – usePlayer.getState().open(id, { expand: true }) in act()
test('tempo sheet sets rate and label uses comma', async () => {
  openExpanded('metro'); render(<FullPlayer />);
  await userEvent.click(screen.getByRole('button', { name: /Скорость/ }));
  await userEvent.click(screen.getByRole('radio', { name: '1,5×' }));
  expect(usePlayer.getState().rate).toBe(1.5); expect(screen.getByRole('button', { name: /1,5×/ })).toBeInTheDocument();
});
test('chapter-end option only with chapters', async () => {
  openExpanded('metro'); render(<FullPlayer />); await userEvent.click(screen.getByRole('button', { name: /Таймер/ }));
  expect(screen.queryByText('До конца главы')).toBeNull();
});
test('chapters sheet seeks', async () => {
  openExpanded('psychology'); render(<FullPlayer />); await userEvent.click(screen.getByRole('button', { name: /Главы/ }));
  await userEvent.click(screen.getAllByRole('button', { name: /Глава 3/ })[0]);
  expect(lib('psychology').positionSec).toBe(lib('psychology').chapters![2].startSec);
});
test('read-along highlights current sentence', () => { /* readAlong an, Position Mitte → aria-current="true" am erwarteten Satz */ });
test('collapse returns to mini player', async () => { /* Klick „Свернуть“ → expanded false */ });
```
```ts
test('long title does not overflow in full player', async ({ page }) => {
  await gotoReady(page); await page.evaluate(() => window.__golos.stores.player.getState().open('sensory-guide', { expand: true }));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/features/player`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test e2e/player.spec.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Vollbild-Player mit Tempo, Sleep-Timer, Kapiteln und Mitlesen"`

---

### Task 11: Gute-Nacht-Player

**Files:**
- Create: `src/features/player/NightPlayer.tsx` (+ `.module.css`), Test `NightPlayer.test.tsx`
- Modify: `src/app/MainShell.tsx` (bei `nightMode && currentId` statt FullPlayer), Styleguide (Night-Ansicht), `ru.ts`

**Interfaces:**
- Consumes: `usePlayer` (nightMode, sleep), UI-Bausteine, `SleepSheet` (Task 10)
- Produces: `<NightPlayer />` mit `data-theme="night"` und `data-testid="night-player"` am eigenen Wurzelelement

**Aufbau:**
- Nur Titel, `ProgressLine`, Zeiten, `SkipButton` · `PlayButton l` · `SkipButton`.
- **Großer Sleep-Timer:**
  - Restzeit in Mono, groß; bei `off` „Таймер выключен“
  - Schnellwahl-Chips „15“, „30“, „45“, „60“ + „Выкл“
- Bei < 60 s Rest der Hinweis „Звук плавно затихает…“.
- Knopf „Выйти из ночного режима“ (Mond) → `setNightMode(false)`; ist `expanded`, erscheint danach der normale FullPlayer.
- Übergang: 400 ms Abdunkeln (bei reduzierter Bewegung sofort).

- [ ] **Step 1: Failing Tests schreiben**

```tsx
test('opening a tale shows the night player with 30:00', () => {
  act(() => usePlayer.getState().open('kolobok', { expand: true })); render(<NightPlayer />);
  expect(screen.getByTestId('night-player')).toHaveAttribute('data-theme', 'night');
  expect(screen.getByText('30:00')).toBeInTheDocument();
});
test('fade hint under one minute', () => { /* sleep remainingMs 50_000 → 'Звук плавно затихает…' */ });
test('exit button leaves night mode', async () => {
  act(() => usePlayer.getState().open('kolobok', { expand: true })); render(<NightPlayer />);
  await userEvent.click(screen.getByRole('button', { name: 'Выйти из ночного режима' }));
  expect(usePlayer.getState().nightMode).toBe(false);
});
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/features/player/NightPlayer.test.tsx`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**

- [ ] **Step 4: Run – passes**
  Run: `npm test`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Gute-Nacht-Player"`

---

### Task 12: Text vertonen + Generierungs-Simulation

**Files:**
- Create:
  - `src/store/generation.ts`, `src/data/samples.ts`
  - `src/features/create/draft.ts`, `SourceScreen.tsx`, `ReviewScreen.tsx`, `OptionsScreen.tsx`, `GeneratingScreen.tsx`, `useGenerationClock.ts` (+ `.module.css`)
- Modify: `src/app/screens.tsx` (`create.*`), `MainShell.tsx` (Clock), `ru.ts`, Styleguide
- Tests: `src/store/generation.test.ts`, `src/features/create/draft.test.ts`, `src/features/create/create.test.tsx`, `e2e/create.spec.ts`

**Interfaces:**
- Consumes: `useLibrary.add/update`, `usePlayer.close/currentId`, `useUi.showBanner`, `useSettings.notifyReady`, `useVoice.status/startSetup`, `useNav`
- Produces:
```ts
// draft.ts
export interface Draft { source: 'text' | 'pdf' | 'link'; text: string; simulatedWords?: number; chapters?: Chapter[];
  title: string; folderId: string | null; tags: string[]; language: LanguageCode; translateTo: LanguageCode | null; style: ReadingStyle }
export const useDraft: { draft: Draft; setDraft(p: Partial<Draft>): void; resetDraft(): void };
export function wordCount(text: string): number;
export function estimateSec(words: number): number;   // Math.round(words / 150 * 60)
export function suggestTitle(text: string): string;   // erster Satz, max. 60 Zeichen, sonst gekürzt mit "…"
// generation.ts
export const useGeneration: { jobs: { recordingId: string; elapsedMs: number; totalMs: number }[];
  start(d: Draft): string;            // legt Recording mit generationProgress 0 an, gibt id zurück
  revoice(id: string): void;          // generationProgress 0, positionSec 0; schließt Player, wenn es die laufende ist
  tick(ms: number): void; reset(): void };
export function jobDurationMs(durationSec: number): number; // min(20000, max(6000, durationSec * 8))
// samples.ts
export const samplePdfs: { fileName: string; title: string; type: RecordingType; text: string; simulatedWords: number; chapters?: Chapter[] }[];
export const sampleLink: { url: string; title: string; text: string; simulatedWords: 2700 };
export const samplePasteText: string;
```
  - PDFs: „Психология общения.pdf“ (book, 9000 Wörter, 6 Kapitel), „Конспект лекции.pdf“ (study, 1200), „Статья о сне.pdf“ (article, 1800).
  - Link: `https://example.com/sensornaya-integratsiya`, Titel „Сенсорная интеграция“ (article, 2700 Wörter → „≈ 18 мин“).
  - Test-Helfer `draftFromLink(): Draft` in `src/test/helpers.ts`: Draft aus `sampleLink`, language `ru`, style `normal`.
  - **Ende eines Jobs:** `generationProgress` entfernen. Wenn `notifyReady`: `showBanner({ title: 'Готово', body: '«<Titel>» можно слушать', recordingId })`.
  - **Übersetzung:** `language = translateTo`, `translatedFrom = draft.language`, `meta = 'Перевод с русского · <Sprache>'`.

**Screens & Texte:**
- **`create.source`** – Titel „Озвучить“, drei große Optionen:
  - „Вставить текст“ / „Из буфера обмена или вручную“
  - „Загрузить PDF“ / „Книги, статьи, документы“ → Sheet mit `samplePdfs`
  - „Ссылка на статью“ / „Мы извлечём текст со страницы“ → Sheet mit vorausgefülltem Link + „Извлечь текст“
- **`create.review`** – „Проверьте текст“:
  - editierbares Textfeld; Statistik `countLabel(words, FORMS.word) + ' · ' + formatEstimate(...)`
  - bei Kapiteln „Найдено “ + `countLabel(n, FORMS.chapter)`
  - „Далее“ deaktiviert bei leerem bzw. nur aus Leerzeichen bestehendem Text, mit Hinweis „Добавьте текст, чтобы продолжить“
  - Bei „Вставить текст“ zusätzlich `PrototypeHint` „Вставить пример (прототип)“
- **`create.options`** – „Параметры“:
  - „Название“ (Vorschlag aus `suggestTitle`), „Папка“, „Теги“
  - „Язык озвучки“ (Русский); Toggle „Перевести перед озвучкой“ → `SegmentedControl` Английский / Китайский / Испанский / Немецкий
  - „Манера чтения“: Обычная / Выразительная / Спокойная, Hinweis bei Спокойная „Для сказок и чтения перед сном“
  - CTA „Озвучить“: deaktiviert bei leerem Titel; nach dem ersten Tippen sofort deaktiviert (kein Doppel-Job)
  - Bei `voice.status === 'none'` ersetzt durch „Сначала настройте голос“ → `voice.startSetup()`
- **`create.generating`** – „Озвучиваем…“:
  - Prozent, „Осталось около N сек“
  - Hinweis „Можно закрыть экран — мы сообщим, когда всё будет готово.“
  - Knopf „В библиотеку“ (→ `switchTab('library')`, `popToRoot('create')`)
  - Fertig: Zustand „Готово“ + „Слушать“

- [ ] **Step 1: Failing Tests schreiben**

```ts
test('estimate and title', () => { expect(estimateSec(2700)).toBe(1080);
  expect(suggestTitle('Сенсорная интеграция. Второе.')).toBe('Сенсорная интеграция'); expect(wordCount('  раз  два ')).toBe(2); });
test('jobDurationMs clamps', () => { expect(jobDurationMs(100)).toBe(6000); expect(jobDurationMs(1080)).toBe(8640); expect(jobDurationMs(9000)).toBe(20000); });
test('start → progress → banner', () => {
  const id = useGeneration.getState().start(draftFromLink());
  expect(lib(id)).toMatchObject({ generationProgress: 0, title: 'Сенсорная интеграция' });
  useGeneration.getState().tick(4320); expect(lib(id).generationProgress).toBeCloseTo(0.5);
  useGeneration.getState().tick(5000); expect(lib(id).generationProgress).toBeUndefined();
  expect(useUi.getState().banner).toMatchObject({ title: 'Готово', recordingId: id });
});
test('no banner when notifications are off', () => { /* notifyReady false → banner null */ });
test('translation sets language and meta', () => { /* translateTo 'zh' → language 'zh', translatedFrom 'ru', meta 'Перевод с русского · Китайский' */ });
test('revoicing the playing recording closes the player', () => {
  usePlayer.getState().open('metro'); useGeneration.getState().revoice('metro');
  expect(usePlayer.getState().currentId).toBeNull(); expect(lib('metro')).toMatchObject({ generationProgress: 0, positionSec: 0 });
});
```
```tsx
test('next is disabled for blank text', async () => { /* Review mit '   ' → Button 'Далее' disabled + Hinweis */ });
test('voice missing replaces CTA', () => { /* status none → 'Сначала настройте голос' sichtbar, 'Озвучить' fehlt */ });
test('Озвучить disables after first tap', async () => { /* zwei Klicks → genau ein Job */ });
```
```ts
// e2e/create.spec.ts
test('link → generating → banner → player', async ({ page }) => {
  await gotoReady(page); await page.getByRole('tab', { name: 'Озвучить' }).click();
  await page.getByRole('button', { name: /Ссылка на статью/ }).click(); await page.getByRole('button', { name: 'Извлечь текст' }).click();
  await expect(page.getByText('≈ 18 мин')).toBeVisible(); await page.getByRole('button', { name: 'Далее' }).click();
  await page.getByRole('button', { name: 'Озвучить' }).click(); await expect(page.getByText('Озвучиваем…')).toBeVisible();
  await expect(page.getByText('Готово', { exact: true }).first()).toBeVisible({ timeout: 25_000 });
});
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/store/generation.test.ts src/features/create`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test e2e/create.spec.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Ablauf Text vertonen mit simulierter Generierung"`

---

### Task 13: Suche, Filter, Ordner, leere Zustände

**Files:**
- Create: `src/features/library/SearchScreen.tsx`, `FolderScreen.tsx`, `SortSheet.tsx` (+ `.module.css`)
- Modify: `screens.tsx` (`library.search`, `library.folder`), `ru.ts`
- Tests: `src/features/library/search.test.tsx`, `e2e/search.spec.ts`

**Interfaces:**
- Consumes: `selectRecordings`, `LibraryQuery`, `useLibrary.folders`, `typeFilterLabel`, UI-Bausteine
- Produces: `library.folder` erwartet `params.folderId`

**`library.search` – „Все записи“:**
- Suchfeld (Platzhalter „Название, тег или тема“, aria „Поиск“).
- Typ-Chips „Все · Книги · Статьи · Языки · Сказки · Учёба“; Zeile mit Ordner-Chips (→ `push library.folder`); Tag-Chips aus allen Tags.
- Sortierknopf → `SortSheet` als `ActionSheet` „Недавние“ / „По названию“ / „По длительности“.
- Ergebnisliste aus `RecordingRow`.
- **Keine Treffer:** `EmptyState` „Ничего не найдено“ / „Попробуйте другой запрос или сбросьте фильтры.“ / Aktion „Сбросить фильтры“.

**`library.folder`:**
- NavBar mit Ordnername und Liste.
- **Leer:** `EmptyState` „В этой папке пока пусто“ / „Добавьте сюда записи через меню «…» у записи.“

- [ ] **Step 1: Failing Tests schreiben**

```tsx
test('search narrows the list with ё-insensitive matching', async () => {
  render(<SearchScreen />); await userEvent.type(screen.getByRole('searchbox', { name: 'Поиск' }), 'ЕЖИК');
  expect(screen.getByText('Ёжик и звёзды')).toBeInTheDocument(); expect(screen.queryByText('Колобок')).toBeNull();
});
test('type chip filters', async () => { /* Klick „Сказки“ → nur tale-Zeilen */ });
test('no results shows reset action that clears filters', async () => {
  render(<SearchScreen />); await userEvent.type(screen.getByRole('searchbox'), 'zzzz');
  await userEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));
  expect(screen.getAllByTestId('recording-row')).toHaveLength(24);
});
test('empty folder state', () => { /* neuer leerer Ordner → 'В этой папке пока пусто' */ });
```
```ts
test('search on device', async ({ page }) => { await gotoReady(page); await page.getByRole('button', { name: 'Поиск' }).click();
  await page.getByRole('searchbox').fill('колобок'); await expect(page.getByText('Колобок')).toBeVisible(); });
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/features/library/search.test.tsx`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test e2e/search.spec.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Suche, Filter, Sortierung, Ordner und leere Zustände"`

---

### Task 14: Aufnahme bearbeiten + Aktionen

**Files:**
- Create: `src/features/library/RecordingActions.tsx`, `EditScreen.tsx`, `CoverPicker.tsx`, `TagEditor.tsx`, `FolderPicker.tsx`, `useLongPress.ts` (+ `.module.css`)
- Modify:
  - `LibraryHome.tsx`, `SearchScreen.tsx`, `FolderScreen.tsx` – `onMore` und langes Drücken verdrahten
  - `screens.tsx` (`library.edit`), Styleguide, `ru.ts`
- Tests: `src/features/library/edit.test.tsx`, `useLongPress.test.ts`, `e2e/edit.spec.ts`

**Interfaces:**
- Consumes: `useLibrary` (rename/setTags/setCover/moveToFolder/remove/createFolder), `useGeneration.revoice`, `usePlayer`, `ActionSheet`, `Sheet`, `Cover`
- Produces:
  - `useLongPress(onLongPress: () => void, ms = 500)` → Pointer-Handler; ein Zeiger-Bewegen > 10 px bricht ab
  - `<RecordingActions recordingId open onClose />`
  - `library.edit` erwartet `params.id`

**Aktionen (`ActionSheet`):**
- „Слушать“
- „Изменить“ (→ `push library.edit`)
- „Озвучить заново“ → Bestätigung „Озвучить «<Titel>» заново?“ / „Будет использована обновлённая версия вашего голоса.“ / „Озвучить“
- „Удалить“ (destruktiv) → Bestätigung „Удалить «<Titel>»?“ / „Запись будет удалена без возможности восстановления.“ / „Удалить“

**`library.edit` – NavBar „Изменить“, rechts „Готово“:**
- „Название“: „Готово“ deaktiviert, solange der Titel leer bzw. nur aus Leerzeichen ist.
- „Обложка“: 3 Typo-Töne + „Фото“ → Sheet „Выбрать фото“ mit 6 Motiven.
- „Теги“: Chips mit ×, Feld + „Добавить“.
- „Папка“: Sheet mit Ordnern, „Без папки“, „Новая папка“ (Eingabe).
- Info-Zeilen „Язык озвучки“, „Манера чтения“ (nur Anzeige).
- „Озвучить заново“, „Удалить запись“.
- Änderungen gelten erst mit „Готово“; „Назад“ verwirft sie.
- Löschen der laufenden Aufnahme → `usePlayer.close()`, dann `pop()`.

- [ ] **Step 1: Failing Tests schreiben**

```tsx
test('rename requires non-blank title and applies on Готово', async () => {
  renderEdit('metro'); const name = screen.getByLabelText('Название');
  await userEvent.clear(name); await userEvent.type(name, '   ');
  expect(screen.getByRole('button', { name: 'Готово' })).toBeDisabled();
  await userEvent.clear(name); await userEvent.type(name, 'Метро'); await userEvent.click(screen.getByRole('button', { name: 'Готово' }));
  expect(lib('metro').title).toBe('Метро');
});
test('back discards changes', async () => { /* Titel ändern, „Назад“ → Titel unverändert */ });
test('tags are trimmed and deduped', async () => { /* ' Новый ', 'новый' hinzufügen → ['…', 'новый'] einmal */ });
test('deleting the playing recording closes the player', async () => {
  usePlayer.getState().open('metro'); renderEdit('metro');
  await userEvent.click(screen.getByRole('button', { name: 'Удалить запись' }));
  await userEvent.click(screen.getByRole('button', { name: 'Удалить' }));
  expect(useLibrary.getState().recordings.find(r => r.id === 'metro')).toBeUndefined();
  expect(usePlayer.getState().currentId).toBeNull();
});
test('cover selection', async () => { /* Ton 'accent' wählen + Готово → cover.tone 'accent' */ });
```
```ts
test('long press fires after 500 ms, movement cancels', () => { /* fake timers */ });
```
```ts
test('row menu → edit → rename on device', async ({ page }) => { /* „Действия“ an „Колобок“ → „Изменить“ → umbenennen → Liste zeigt neuen Titel */ });
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/features/library`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test e2e/edit.spec.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Aufnahmen bearbeiten, Aktionen, Neu-Vertonen und Löschen"`

---

### Task 15: Stimme einrichten (Onboarding) + Recorder

**Files:**
- Create:
  - `src/data/phrases.ts` (30 Phrasen)
  - `src/features/voice/Recorder.tsx`, `LevelMeter.tsx`
  - `src/features/onboarding/OnboardingFlow.tsx`, `Welcome.tsx`, `Expectation.tsx`, `Prepare.tsx`, `QualityCheck.tsx`, `Creating.tsx`, `FirstSample.tsx` (+ `.module.css`)
- Modify: `src/app/App.tsx` (Onboarding-Platzhalter ersetzen), Styleguide (Recorder-Zustände), `ru.ts`
- Tests: `src/features/voice/Recorder.test.tsx`, `src/features/onboarding/onboarding.test.tsx`, `e2e/onboarding.spec.ts`

**Interfaces:**
- Consumes: `useVoice` (setupStep, phraseIndex, forceTooQuiet, finishSetup, completeOnboarding), `useNav`, UI-Bausteine, `PrototypeHint`
- Produces:
```tsx
<Recorder mode: 'phrases' | 'free' phrases?: string[] prompt?: string index? onIndexChange? onDone forceTooQuietAt?: number />
// phrases: Kopf "Фраза {i+1} из {n}", Phrase groß, LevelMeter, Aufnahmeknopf (aria "Записать фразу" / "Остановить")
//   nach Stopp: "Переписать" + "Дальше"; Aufnahme endet automatisch nach 2 s
//   Phrase mit Index forceTooQuietAt (Standard 2, also „Фраза 3“): erster Versuch → Warnung
//   "Слишком тихо — попробуйте ещё раз", „Дальше“ deaktiviert bis zum erneuten Aufnehmen
//   PrototypeHint "Записать все фразы (прототип)" → onDone()
// free: Prompt groß, Timer mm:ss, Knopf "Начать" / "Закончить" (mind. 5 s simuliert), PrototypeHint "Завершить (прототип)"
```

**Schritte (`OnboardingFlow` über `voice.setupStep`; „Назад“ überall außer bei `creating`):**
- **welcome**
  - Titel „Слушайте любой текст своим голосом“
  - Text „Статьи, книги, уроки и сказки — голосом, который вам ближе всего.“
  - „Начать“ und „Позже“ (→ `completeOnboarding()`, Stimme bleibt `none`)
- **expectation**
  - „Сначала голос покажется непривычным“
  - „Обычно мы слышим себя изнутри — через кости черепа. Со стороны голос звучит иначе. Через несколько прослушиваний это проходит.“
  - „Понятно“
- **prepare**
  - „Подготовьтесь“ mit Liste „Тихая комната без эха“ · „Телефон — в 20 см ото рта“ · „Около 10 минут — можно делать перерывы“
  - „Начать запись“
- **record** – `Recorder` mit 30 Phrasen; Index bleibt in `voice.phraseIndex` (Pausieren und Fortsetzen möglich), Knopf „Пауза“ → zurück zu `prepare`
- **quality**
  - „Запись получилась хорошей“ mit drei Häkchen „Громкость“ · „Фоновый шум“ · „Чёткость“
  - „Создать голос“
- **creating** – „Создаём ваш голос…“ mit Fortschritt, simuliert 4 s → `finishSetup()`
- **sample**
  - „Послушайте себя“: simulierte 20-s-Wiedergabe mit `ProgressLine`
  - Hinweis „Звучит непривычно? Это нормально — дайте себе пару дней.“
  - „Озвучить первый текст“ (→ `completeOnboarding()`, `switchTab('create')`) und „В библиотеку“

Wird das Onboarding über `voice.startSetup()` (aus der App) gestartet, beginnt es bei `prepare` und kehrt nach `sample` in die App zurück.

- [ ] **Step 1: Failing Tests schreiben**

```tsx
// recordOnce(): testlokal – Klick „Записать фразу“, dann vi.advanceTimersByTime(2000) (fake timers)
test('recorder shows counter and forced warning on phrase 3', async () => {
  render(<Recorder mode="phrases" phrases={phrases} index={2} onIndexChange={() => {}} onDone={() => {}} forceTooQuietAt={2} />);
  expect(screen.getByText('Фраза 3 из 30')).toBeInTheDocument();
  await recordOnce(); expect(screen.getByText('Слишком тихо — попробуйте ещё раз')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Дальше' })).toBeDisabled();
});
test('prototype hint finishes recording', async () => { /* Klick → onDone */ });
test('Позже completes onboarding without voice', async () => {
  render(<OnboardingFlow />); await userEvent.click(screen.getByRole('button', { name: 'Позже' }));
  expect(useVoice.getState()).toMatchObject({ onboardingDone: true, status: 'none' });
});
test('full happy path ends ready', async () => { /* Начать → Понятно → Начать запись → Hint → Создать голос → (fake timers 4 s) → 'Послушайте себя' → В библиотеку; status ready, quality 86 */ });
```
```ts
test('first visit starts onboarding and reaches library', async ({ page }) => {
  await page.goto('/'); await page.evaluate(() => localStorage.clear()); await page.reload();
  await expect(page.getByText('Слушайте любой текст своим голосом')).toBeVisible();
  // Klickpfad wie oben bis 'В библиотеку' → Tab 'Библиотека' sichtbar
});
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/features/voice src/features/onboarding`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test e2e/onboarding.spec.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Onboarding mit geführter Stimmaufnahme"`

---

### Task 16: Tab Голос – Stimme verbessern und neu vertonen

**Files:**
- Create: `src/data/sessions.ts`, `src/features/voice/VoiceHome.tsx`, `VoiceSessionScreen.tsx`, `RevoiceScreen.tsx` (+ `.module.css`)
- Modify: `screens.tsx` (`voice.*`), Styleguide, `ru.ts`
- Tests: `src/features/voice/voiceTab.test.tsx`, `e2e/voice.spec.ts`

**Interfaces:**
- Consumes: `useVoice`, `Recorder` (Task 15), `useGeneration.revoice` (Task 12), `useLibrary`, `formatDay`, `countLabel`
- Produces:
  - `sessions: { id: SessionId; title: string; subtitle: string; mode: 'free' | 'phrases'; prompt?: string; phrases?: string[] }[]`
    - `story` „Расскажите историю о себе“ (free)
    - `excerpt` „Прочитайте отрывок“ (5 Phrasen)
    - `emotion` „Прочитайте с эмоцией“ (5 Phrasen)
    - je Untertitel „Около 5 минут“
  - `voice.session` erwartet `params.id`

**`voice.home` – Titel „Голос“:**
- **Stimm-Karte** (`surfaceInverse`):
  - „Ваш голос · 86 %“ mit Qualitätsbalken
  - `'Записано ' + countLabel(minutes, FORMS.minute)`
  - „Обновлён “ + `formatDay`
- **„Улучшить голос“:** die drei Sessions, erledigte mit ✓.
- **„Манеры чтения“:** Обычная / Выразительная / Спокойная mit Mini-Play (simulierte 10 s).
- **Bei `status === 'none'`:** Karte „Голос ещё не настроен“ + „Настроить голос“ → `startSetup()`.

**`voice.session`:**
- `Recorder` → `finishSession(id)` → Erfolgsansicht „Голос обновлён: 89 %“
- Danach Frage „Озвучить старые записи заново?“ mit „Выбрать записи“ (→ `push voice.revoice`) und „Не сейчас“

**`voice.revoice` – „Озвучить заново“:**
- Checkliste aller Aufnahmen außer gerade vertonten, „Выбрать все“.
- CTA `'Озвучить заново (' + n + ')'`, deaktiviert bei 0 → `revoice` je id → `popToRoot('voice')`.

- [ ] **Step 1: Failing Tests schreiben**

```tsx
test('voice card shows quality, minutes with plural, updated day', () => {
  useVoice.setState({ status: 'ready', quality: 86, minutes: 10, updatedAt: new Date().toISOString(), onboardingDone: true });
  render(<VoiceHome />); expect(screen.getByText('Ваш голос · 86 %')).toBeInTheDocument();
  expect(screen.getByText('Записано 10 минут')).toBeInTheDocument(); expect(screen.getByText('Обновлён сегодня')).toBeInTheDocument();
});
test('session completion raises quality and offers revoice', async () => { /* story beenden → 'Голос обновлён: 89 %' */ });
test('revoice selected starts jobs and disables when none selected', async () => { /* 2 wählen → CTA 'Озвучить заново (2)' → 2 Jobs */ });
test('missing voice shows setup card', () => { /* status none → 'Настроить голос' */ });
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/features/voice/voiceTab.test.tsx`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test e2e/voice.spec.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Tab Голос mit Nachaufnahmen und Neu-Vertonen"`

---

### Task 17: Profil, Einstellungen, Theme-Umschaltung

**Files:**
- Create: `src/features/profile/ProfileScreen.tsx` (+ `.module.css`)
- Modify: `screens.tsx` (`profile.home`), `ru.ts`, Styleguide
- Tests: `src/features/profile/profile.test.tsx`, `e2e/settings.spec.ts`

**Interfaces:**
- Consumes: `useSettings`, `useVoice.deleteVoice`, `useNav.switchTab`, `RATES`, `formatRate`
- Produces: `profile.home` mit Slot am Ende für `PrototypeMenu` (Task 18)

**Aufbau `profile.home` – Titel „Профиль“:**
- Kopf: Avatar-Initiale + Name (Tippen → Sheet „Имя“, leere Eingabe wird nicht übernommen).
- Gruppen:
  - **„Оформление“:** `SegmentedControl` „Светлая / Тёмная / Как в системе“
  - **„Воспроизведение“:**
    - „Скорость по умолчанию“ (Sheet mit `RATES`)
    - „Шаг перемотки“ `SegmentedControl` „10 сек / 15 сек / 30 сек“
    - „Таймер сна по умолчанию“ (Sheet)
  - **„Уведомления“:** Toggle „Когда озвучка готова“
  - **„Голос“:**
    - „Управление голосом“ → `switchTab('voice')`
    - „Удалить данные голоса“ (destruktiv) → `ActionSheet` „Удалить данные голоса?“ / „Записи останутся, но озвучивать новые тексты будет нельзя, пока вы не настроите голос заново.“ / „Удалить“
  - **„Хранилище“:** „Сохранено офлайн · 1,2 ГБ“
  - **„О приложении“:** „Прототип 0.1“

- [ ] **Step 1: Failing Tests schreiben**

```tsx
test('theme switch sets data-theme on app root', async () => {
  useVoice.setState({ onboardingDone: true, status: 'ready' }); useNav.getState().switchTab('profile');
  render(<App />); await userEvent.click(screen.getByRole('radio', { name: 'Тёмная' }));
  expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark');
});
test('skip step changes SkipButton label', async () => { /* 30 сек wählen → useSettings.skipStep 30 */ });
test('delete voice keeps recordings', async () => { /* bestätigen → status none, recordings 24 */ });
test('blank name is ignored', async () => { /* '   ' speichern → Name unverändert */ });
```
```ts
test('dark theme on device', async ({ page }) => { await gotoReady(page); await page.getByRole('tab', { name: 'Профиль' }).click();
  await page.getByRole('radio', { name: 'Тёмная' }).click(); await expect(page.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark'); });
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/features/profile`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test e2e/settings.spec.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Profil und Einstellungen"`

---

### Task 18: Prototyp-Menü, Szenarien, Desktop-Panel

**Files:**
- Create: `src/app/scenarios.ts`, `src/features/profile/PrototypeMenu.tsx`, `src/app/PrototypePanel.tsx` (+ `.module.css`)
- Modify:
  - `src/app/devHooks.ts`: `window.__golos.runScenario` ergänzen (weiterhin nur DEV). `runScenario` selbst ist ein normales Modul und funktioniert über das Prototyp-Menü auch im Produktions-Build.
  - `ProfileScreen.tsx` (Menü einhängen), `PhoneFrame.tsx` (Panel daneben), `e2e/helpers.ts` (`gotoReady` → `runScenario('ready')`)
- Tests: `src/app/scenarios.test.ts`, `src/features/profile/PrototypeMenu.test.tsx`, `e2e/scenarios.spec.ts`

**Interfaces:**
- Consumes: `reset()` aller Stores, `useGeneration.start`, `samplePdfs`/`sampleLink`, `useUi.showBanner`, `usePlayer.open`, `useNav`
- Produces:
```ts
export type ScenarioId = 'reset' | 'ready' | 'voiceMissing' | 'emptyLibrary' | 'generating' | 'tooQuiet' | 'readyBanner' | 'night';
export const scenarioLabels: Record<ScenarioId, string>; // in ru.ts
export function runScenario(id: ScenarioId): void;
```

| id | Label | Wirkung |
|---|---|---|
| reset | Сбросить всё | alle Stores `reset()`, Persistenz leeren → Onboarding `welcome` |
| ready | Пропустить онбординг | reset + `completeOnboarding()` + `finishSetup()` → Bibliothek |
| voiceMissing | Голос не настроен | ready + `deleteVoice()` → Bibliothek |
| emptyLibrary | Пустая библиотека | ready + `useLibrary.clear()` + `usePlayer.close()` |
| generating | Идёт озвучивание | ready + `start(draft aus sampleLink)` → Tab create, `push create.generating` |
| tooQuiet | Предупреждение «Слишком тихо» | ready + `startSetup()`, `setupStep 'record'`, `phraseIndex 2`, `forceTooQuiet true` |
| readyBanner | Баннер «Готово» | ready + `showBanner({ title:'Готово', body:'«Сенсорная интеграция при аутизме» можно слушать', recordingId:'sensory' })` |
| night | Ночной режим | ready + `open('kolobok', { expand: true })` |

- `ready` ergänzt die Spec-Liste (6.9), damit Kunde und Tests ohne Onboarding starten können.
- `PrototypeMenu` am Ende von „Профиль“:
  - gestrichelt umrandet, Überschrift „Прототип“, Hinweis „Этого раздела не будет в приложении“
  - je Szenario ein Knopf
- `PrototypePanel` (nur Desktop, rechts neben dem Rahmen): dieselben Knöpfe.

- [ ] **Step 1: Failing Tests schreiben**

```ts
test('reset returns to first start', () => { runScenario('ready'); runScenario('reset');
  expect(useVoice.getState()).toMatchObject({ onboardingDone: false, setupStep: 'welcome' }); expect(useLibrary.getState().recordings).toHaveLength(24); });
test('voiceMissing', () => { runScenario('voiceMissing'); expect(useVoice.getState()).toMatchObject({ onboardingDone: true, status: 'none' }); });
test('emptyLibrary', () => { runScenario('emptyLibrary'); expect(useLibrary.getState().recordings).toHaveLength(0); });
test('generating', () => { runScenario('generating'); expect(useGeneration.getState().jobs).toHaveLength(1);
  expect(top('create')).toBe('create.generating'); });
test('tooQuiet', () => { runScenario('tooQuiet'); expect(useVoice.getState()).toMatchObject({ setupActive: true, setupStep: 'record', phraseIndex: 2, forceTooQuiet: true }); });
test('night', () => { runScenario('night'); expect(usePlayer.getState()).toMatchObject({ currentId: 'kolobok', nightMode: true }); });
```
```tsx
test('menu lists all scenarios', () => { render(<PrototypeMenu />);
  expect(screen.getByText('Этого раздела не будет в приложении')).toBeInTheDocument();
  expect(screen.getAllByRole('button')).toHaveLength(8); });
```
```ts
test('scenario buttons work on device', async ({ page }) => { /* ready → Профиль → 'Ночной режим' → night-player sichtbar */ });
```

- [ ] **Step 2: Run – fails**
  Run: `npx vitest run src/app/scenarios.test.ts src/features/profile`
  Expected: FAIL.

- [ ] **Step 3: Implementieren**

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test`
  Expected: alle Unit- und E2E-Tests PASS.

- [ ] **Step 5: Commit**
  `git commit -am "feat: Prototyp-Menü mit Szenarien"`

---

### Task 19: Qualitätsprüfung – Überlauf, Barrierefreiheit, Touch-Ziele, Look

**Files:**
- Create: `e2e/quality.spec.ts`, `e2e/screens.ts` (Liste aller erreichbaren Screens mit Weg dorthin), `review/anti-slop.md`
- Modify: beliebige Komponenten, um Befunde zu beheben

**Interfaces:**
- Consumes: `runScenario`, Navigation über die UI
- Produces:
  - `export const screensToCheck: { name: string; reach(page: Page): Promise<void> }[]`
    - deckt jeden `ScreenName`, FullPlayer, NightPlayer, alle Sheets, Onboarding-Schritte, leere Zustände und Styleguide ab
  - Screenshots unter `review/screenshots/<projekt>/<name>.png`

- [ ] **Step 1: Failing Tests schreiben**

```ts
for (const s of screensToCheck) test(`quality: ${s.name}`, async ({ page }, info) => {
  await s.reach(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const clipped = await page.evaluate(() => [...document.querySelectorAll('button,[role=tab],[role=radio],h1,h2,h3')]
    .filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent));
  expect(clipped).toEqual([]);
  const small = await page.evaluate(() => [...document.querySelectorAll('button,[role=tab],[role=radio],[role=switch],[role=slider],a')]
    .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.width < 44 || r.height < 44); }).map(e => e.outerHTML.slice(0, 80)));
  expect(small).toEqual([]);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(axe.violations).toEqual([]);
  await page.screenshot({ path: `review/screenshots/${info.project.name}/${s.name}.png` });
});
test('no screen still renders a placeholder', async ({ page }) => { /* jeder ScreenName erreichbar und ohne data-testid="placeholder" */ });
```

- [ ] **Step 2: Run – erste Befunde sammeln**
  Run: `npx playwright test e2e/quality.spec.ts --project=iphone-375 --project=iphone-430`
  Expected: Befunde (FAIL) oder PASS. Jeden Befund beheben (Titel-Kürzung, Mindestgrößen, Labels) und erneut laufen lassen.

- [ ] **Step 3: Anti-Slop- und Copy-Prüfung**
  - Skill `avoiding-ai-website-slop` laden und Schritte 4 (Gold-Standard-Vergleich: Screenshots gegen `studiya-player-v2.html` rechts) und 6 (Copy-Checkliste) auf alle Screens anwenden.
  - Zusätzlich `ui-ux-pro-max` für iOS-Mobile-Regeln.
  - Befunde, Fundstelle und Behebung in `review/anti-slop.md` festhalten.
  - Alle Punkte mit Bewertung „muss“ beheben.

- [ ] **Step 4: Run – passes**
  Run: `npm test && npx playwright test`
  Expected: alle PASS.

- [ ] **Step 5: Commit**
  `git add -A && git commit -m "test: Qualitätsprüfung für Überlauf, Barrierefreiheit und Look"`

---

### Task 20: Build und Teilen als privates Artifact

**Files:**
- Modify: ggf. `vite.config.ts` (Asset-Dateinamen ohne Unterordner, falls das Artifact-Publishing es verlangt)

**Interfaces:**
- Consumes: kompletter Prototyp
- Produces: privater Artifact-Link für den Designer (nicht direkt an den Kunden senden)

- [ ] **Step 1: Bauen und lokal prüfen**
  Run: `npm run build && npx vite preview --port 5176`
  Expected: Build ohne Fehler; `http://localhost:5176/` zeigt das Onboarding, `#/styleguide` den Styleguide.

- [ ] **Step 2: Veröffentlichen**
  - Skill `artifact-design` laden.
  - `dist/index.html` mit dem Artifact-Tool veröffentlichen:
    - `files` = alle Dateien unter `dist/assets/` mit ihrem relativen Pfad
    - `icon: "audio"`, Beschreibung „Klickbarer UX/UI-Prototyp der golos-App (russisch)“
  - Danach mit `action: read` prüfen, dass Skripte und Styles eingebunden sind.

- [ ] **Step 3: Auf iPhone-Viewport prüfen**
  - Den Artifact-Link mit dem Playwright-Plugin bei 390 × 844 öffnen und „Позже“ → Bibliothek → Player durchklicken.
  - Screenshot ansehen.
  - Expected: Darstellung wie lokal.
  - Falls nicht (Skelett-Wrapping, fehlende Dateien, Meta-Tags): **anhalten** und dem Designer die Ausweichoption statischer Hoster vorlegen – nicht eigenmächtig woanders veröffentlichen.

- [ ] **Step 4: Commit**
  `git commit -am "chore: Build-Konfiguration für das Teilen"` (nur falls Dateien geändert wurden)
