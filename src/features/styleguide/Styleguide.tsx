import { useState, type ReactNode } from 'react';
import { t } from '../../content/ru';
import { seedRecordings } from '../../data/seed';
import type { Recording } from '../../data/types';
import { contrastRatio } from '../../design/contrast';
import { colorTokenNames, colors, contrastRules, radius, typeScale, type ThemeName, type TypeStyleName } from '../../design/tokens';
import { Button } from '../../ui/Button';
import { Chip } from '../../ui/Chip';
import { Cover } from '../../ui/Cover';
import { EmptyState } from '../../ui/EmptyState';
import { NavBar } from '../../ui/NavBar';
import { PlayButton } from '../../ui/PlayButton';
import { ProgressLine } from '../../ui/ProgressLine';
import { PrototypeHint } from '../../ui/PrototypeHint';
import { RecordingRow } from '../../ui/RecordingRow';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { SkipButton } from '../../ui/SkipButton';
import { TabBar } from '../../ui/TabBar';
import { TextField } from '../../ui/TextField';
import { Toggle } from '../../ui/Toggle';
import { phrases } from '../../data/phrases';
import { RATES, type Cover as CoverData } from '../../data/types';
import { formatRate } from '../../i18n/format';
import { usePlayer } from '../../store/player';
import { ActionSheet } from '../../ui/ActionSheet';
import { BannerView } from '../../ui/Banner';
import { ICON_NAMES, Icon } from '../../ui/icons';
import { Sheet } from '../../ui/Sheet';
import { ContinueCard } from '../library/ContinueCard';
import { CoverPicker } from '../library/CoverPicker';
import { FolderPicker } from '../library/FolderPicker';
import { TagEditor } from '../library/TagEditor';
import { VoiceMissingRow } from '../library/VoiceMissingRow';
import { FullPlayer } from '../player/FullPlayer';
import { MiniPlayer } from '../player/MiniPlayer';
import { NightPlayer } from '../player/NightPlayer';
import { LevelMeter } from '../voice/LevelMeter';
import { Recorder } from '../voice/Recorder';
import { VoiceCard } from '../voice/VoiceCard';
import styles from './Styleguide.module.css';

// Beschriftungen auf Deutsch (für Designer und Entwickler), Beispielinhalte russisch.

const themeNames: Record<ThemeName, string> = { light: 'Hell', dark: 'Dunkel', night: 'Nacht (Gute-Nacht-Player)' };
const THEMES: ThemeName[] = ['light', 'dark', 'night'];
const comma = (n: number) => n.toFixed(2).replace('.', ',');
const rec = (id: string): Recording => seedRecordings.find((r) => r.id === id)!;
const metroCover = rec('metro').cover;
const metroGlyph = metroCover.kind === 'typo' ? metroCover.glyph : undefined;

const typeSamples: Record<TypeStyleName, string> = {
  titleXL: t.styleguide.titleXL,
  title: t.styleguide.title,
  body: t.styleguide.body,
  meta: t.styleguide.meta,
  mono: t.styleguide.mono,
  label: t.styleguide.label,
};

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.item}>
      <p className={styles.itemLabel}>{label}</p>
      <div className={styles.itemBody}>{children}</div>
    </div>
  );
}

function Board({ theme }: { theme: 'light' | 'dark' }) {
  const [seg, setSeg] = useState('a');
  const [on, setOn] = useState(true);
  const [field, setField] = useState<string>(t.styleguide.fieldValue);
  const [tags, setTags] = useState<string[]>(rec('metro').tags);
  const [cover, setCover] = useState<CoverData>(rec('metro').cover);
  const [rate, setRate] = useState<number>(1);
  return (
    <div data-testid="component-board" data-theme={theme} className={styles.board}>
      <h3 className={styles.h3}>{themeNames[theme]}</h3>
      <Item label="ContinueCard">
        <div className={styles.narrow}>
          <ContinueCard recording={rec('metro')} />
        </div>
      </Item>
      <Item label="Button: filled · outline · plain · destructive · disabled">
        <div className={styles.stack}>
          <Button>{t.styleguide.filled}</Button>
          <Button variant="outline" trailing="+">
            {t.library.create}
          </Button>
          <Button variant="plain" full={false}>
            {t.styleguide.plain}
          </Button>
          <Button variant="destructive">{t.styleguide.destructive}</Button>
          <Button disabled>{t.styleguide.disabled}</Button>
        </div>
      </Item>
      <Item label="PlayButton (l/m, aus/an) · SkipButton (10/15/30)">
        <div className={styles.row}>
          <PlayButton playing={false} onToggle={() => {}} />
          <PlayButton playing onToggle={() => {}} />
          <PlayButton size="m" playing={false} onToggle={() => {}} />
          <SkipButton direction="back" step={15} onClick={() => {}} />
          <SkipButton direction="forward" step={15} onClick={() => {}} />
          <SkipButton direction="back" step={10} onClick={() => {}} />
          <SkipButton direction="forward" step={30} onClick={() => {}} />
        </div>
      </Item>
      <Item label="ProgressLine (auf Hintergrund)">
        <div className={styles.narrow}>
          <ProgressLine valueSec={761} max={1100} onSeek={() => {}} />
        </div>
      </Item>
      <Item label="RecordingRow: neu · angefangen · gehört · wird vertont">
        <div className={styles.narrow}>
          <RecordingRow recording={rec('kolobok')} index={1} onPress={() => {}} onMore={() => {}} />
          <RecordingRow recording={rec('psychology')} index={2} onPress={() => {}} onMore={() => {}} />
          <RecordingRow recording={rec('thesis')} index={3} onPress={() => {}} onMore={() => {}} />
          <RecordingRow recording={{ ...rec('sensory'), generationProgress: 0.42 }} index={4} onPress={() => {}} />
        </div>
      </Item>
      <Item label="Cover: ink · paper · accent · Glyph · Foto 1–6">
        <div className={styles.row}>
          <Cover cover={{ kind: 'typo', tone: 'ink' }} title={rec('kolobok').title} size="m" />
          <Cover cover={{ kind: 'typo', tone: 'paper' }} title={rec('teremok').title} size="m" />
          <Cover cover={{ kind: 'typo', tone: 'accent' }} title={rec('sensory').title} size="m" />
          <Cover cover={{ kind: 'typo', tone: 'ink', glyph: '中' }} title="" size="m" />
          {([1, 2, 3, 4, 5, 6] as const).map((p) => (
            <Cover key={p} cover={{ kind: 'photo', preset: p }} title="" size="m" />
          ))}
        </div>
      </Item>
      <Item label="Chip · SegmentedControl · Toggle">
        <div className={styles.stack}>
          <div className={styles.row}>
            <Chip selected onClick={() => {}}>
              {t.styleguide.chipA}
            </Chip>
            <Chip onClick={() => {}}>{t.styleguide.chipB}</Chip>
          </div>
          <SegmentedControl<string>
            ariaLabel="Demo"
            value={seg}
            onChange={setSeg}
            options={[
              { value: 'a', label: t.styleguide.segA },
              { value: 'b', label: t.styleguide.segB },
            ]}
          />
          <Toggle checked={on} onChange={setOn} label={t.styleguide.toggle} />
        </div>
      </Item>
      <Item label="TextField · PrototypeHint">
        <div className={styles.stack}>
          <TextField label={t.styleguide.field} value={field} onChange={setField} />
          <PrototypeHint onClick={() => {}}>{t.styleguide.hint}</PrototypeHint>
        </div>
      </Item>
      <Item label="NavBar">
        <div className={styles.narrow}>
          <NavBar title={t.styleguide.nav} onBack={() => {}} right={<Button variant="plain" full={false}>{t.common.done}</Button>} />
        </div>
      </Item>
      <Item label="EmptyState">
        <div className={styles.narrow}>
          <EmptyState title={t.styleguide.emptyTitle} body={t.styleguide.emptyBody} action={{ label: t.styleguide.emptyAction, onClick: () => {} }} />
        </div>
      </Item>
      <Item label="Sheet (inline)">
        <div className={styles.narrow}>
          <Sheet open inline onClose={() => {}} title={t.player.speed}>
            <SegmentedControl<number>
              ariaLabel={t.player.speed}
              value={rate}
              onChange={setRate}
              options={RATES.map((r) => ({ value: r, label: formatRate(r) }))}
            />
          </Sheet>
        </div>
      </Item>
      <Item label="ActionSheet (inline)">
        <div className={styles.narrow}>
          <ActionSheet
            open
            inline
            onClose={() => {}}
            title={rec('kolobok').title}
            actions={[
              { label: t.actions.listen, onSelect: () => {} },
              { label: t.actions.edit, onSelect: () => {} },
              { label: t.actions.revoice, onSelect: () => {} },
              { label: t.actions.delete, destructive: true, onSelect: () => {} },
            ]}
          />
        </div>
      </Item>
      <Item label="Banner">
        <BannerView inline title={t.create.doneTitle} body={t.create.readyBody(rec('sensory').title)} onPress={() => {}} />
      </Item>
      <Item label="Recorder: bereit · Aufnahme · aufgenommen · zu leise">
        <div className={styles.recorders}>
          {(['idle', 'recording', 'recorded', 'tooQuiet'] as const).map((d) => (
            <div key={d} className={styles.recorderBox}>
              <Recorder mode="phrases" phrases={phrases} index={2} onIndexChange={() => {}} onDone={() => {}} demoState={d} />
            </div>
          ))}
        </div>
      </Item>
      <Item label="LevelMeter: aus · an">
        <div className={styles.row}>
          <LevelMeter active={false} />
          <LevelMeter active />
        </div>
      </Item>
      <Item label="TagEditor">
        <div className={styles.narrow}>
          <TagEditor tags={tags} onChange={setTags} />
        </div>
      </Item>
      <Item label="FolderPicker (inline)">
        <div className={styles.narrow}>
          <FolderPicker open inline onClose={() => {}} value="chinese" onChange={() => {}} />
        </div>
      </Item>
      <Item label="CoverPicker">
        <CoverPicker cover={cover} title={rec('metro').title} glyph={metroGlyph} onChange={setCover} />
      </Item>
      <Item label="VoiceMissingRow">
        <div className={styles.narrow}>
          <VoiceMissingRow />
        </div>
      </Item>
      <Item label="VoiceCard">
        <div className={styles.narrow}>
          <VoiceCard quality={86} minutes={10} updatedAt={new Date().toISOString()} />
        </div>
      </Item>
      <Item label="Icons">
        <div className={styles.icons}>
          {ICON_NAMES.map((n) => (
            <span key={n} className={styles.iconCell}>
              <Icon name={n} />
              <code className={styles.hex}>{n}</code>
            </span>
          ))}
        </div>
      </Item>
      <Item label="TabBar (Dock)">
        <div className={styles.dockBox}>
          <TabBar />
        </div>
      </Item>
    </div>
  );
}

function PlayerPreview() {
  const current = usePlayer((s) => s.currentId);
  const night = usePlayer((s) => s.nightMode);
  return (
    <div className={styles.row}>
      <div className={styles.miniBox}>{current && !night ? <MiniPlayer /> : null}</div>
      <div className={styles.phoneBox}>{current && !night ? <FullPlayer /> : null}</div>
      <Button variant="outline" full={false} onClick={() => usePlayer.getState().open('psychology')}>
        Demo laden
      </Button>
    </div>
  );
}

function NightPreview() {
  const current = usePlayer((s) => s.currentId);
  return (
    <div className={styles.row}>
      <div className={styles.phoneBox}>{current ? <NightPlayer /> : null}</div>
      <Button variant="outline" full={false} onClick={() => usePlayer.getState().open('kolobok', { expand: true })}>
        Demo laden
      </Button>
    </div>
  );
}

export function Styleguide() {
  return (
    <div className={styles.page} data-theme="light">
      <header className={styles.header}>
        <h1 className={styles.h1}>Styleguide golos</h1>
        <p className={styles.lead}>
          Richtung B „Studio“ (Hi-Fi hell). Quelle aller Werte: src/design/tokens.ts. Diese Seite ist die Übergabe an die
          spätere App-Implementierung.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.h2}>Farben</h2>
        {THEMES.map((th) => (
          <div key={th} className={styles.themeBlock}>
            <h3 className={styles.h3}>{themeNames[th]}</h3>
            <div className={styles.swatches}>
              {colorTokenNames.map((name) => (
                <div key={name} data-testid="swatch" className={styles.swatch}>
                  <span className={styles.chipColor} style={{ background: colors[th][name] }} />
                  <code className={styles.code}>{name}</code>
                  <code className={styles.hex}>{colors[th][name]}</code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Kontrast</h2>
        <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Theme</th>
              <th>Vordergrund / Hintergrund</th>
              <th>Verhältnis</th>
              <th>Minimum</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {THEMES.flatMap((th) =>
              contrastRules.map((r) => {
                const ratio = contrastRatio(colors[th][r.fg], colors[th][r.bg]);
                return (
                  <tr key={`${th}-${r.fg}-${r.bg}`} data-testid="contrast-row">
                    <td>{themeNames[th]}</td>
                    <td>
                      <span className={styles.pair} data-decor aria-hidden="true" style={{ background: colors[th][r.bg], color: colors[th][r.fg] }}>
                        Aa
                      </span>{' '}
                      {r.fg} / {r.bg}
                    </td>
                    <td>{comma(ratio)} : 1</td>
                    <td>{String(r.min).replace('.', ',')} : 1</td>
                    <td>{ratio >= r.min ? '✓' : '✗'}</td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Typografie</h2>
        {(Object.keys(typeScale) as TypeStyleName[]).map((name) => {
          const s = typeScale[name];
          return (
            <div key={name} className={styles.typeRow}>
              <code className={styles.code}>
                {name} · {s.family === 'sans' ? 'Onest' : 'JetBrains Mono'} {s.sizePx}/{s.weight} · {s.letterSpacingEm} em
              </code>
              <p
                style={{
                  fontFamily: `var(--font-${s.family})`,
                  fontSize: s.sizePx,
                  fontWeight: s.weight,
                  lineHeight: s.lineHeight,
                  letterSpacing: `${s.letterSpacingEm}em`,
                  textTransform: name === 'label' ? 'uppercase' : undefined,
                }}
              >
                {typeSamples[name]}
              </p>
            </div>
          );
        })}
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Formen</h2>
        <div className={styles.row}>
          {Object.entries(radius).map(([k, v]) => (
            <div key={k} className={styles.radius} style={{ borderRadius: Math.min(v, 40) }}>
              <code className={styles.code}>
                {k} · {v === 999 ? 'rund' : `${v} px`}
              </code>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Mini-Player und Vollbild-Player</h2>
        <PlayerPreview />
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Gute-Nacht-Player (Theme night)</h2>
        <NightPreview />
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Komponenten</h2>
        <div className={styles.boards}>
          <Board theme="light" />
          <Board theme="dark" />
        </div>
      </section>
    </div>
  );
}
