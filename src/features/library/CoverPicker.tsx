import { useState } from 'react';
import { t } from '../../content/ru';
import type { Cover as CoverData } from '../../data/types';
import { Cover } from '../../ui/Cover';
import { Icon } from '../../ui/icons';
import { Sheet } from '../../ui/Sheet';
import styles from './CoverPicker.module.css';

type Tone = 'ink' | 'paper' | 'accent';
const TONES: { tone: Tone; label: string }[] = [
  { tone: 'ink', label: t.edit.coverInk },
  { tone: 'paper', label: t.edit.coverPaper },
  { tone: 'accent', label: t.edit.coverAccent },
];
const PRESETS = [1, 2, 3, 4, 5, 6] as const;

interface Props {
  cover: CoverData;
  title: string;
  glyph?: string;
  onChange(c: CoverData): void;
}

export function CoverPicker({ cover, title, glyph, onChange }: Props) {
  const [sheet, setSheet] = useState(false);
  return (
    <div className={styles.picker}>
      <p className={styles.label}>{t.edit.cover}</p>
      <div className={styles.row}>
        {TONES.map(({ tone, label }) => {
          const selected = cover.kind === 'typo' && cover.tone === tone;
          const c: CoverData = { kind: 'typo', tone, ...(glyph ? { glyph } : {}) };
          return (
            <button key={tone} className={`${styles.option} ${selected ? styles.selected : ''}`} aria-label={label} aria-pressed={selected} onClick={() => onChange(c)}>
              <Cover cover={c} title={title} size="m" />
            </button>
          );
        })}
        <button
          className={`${styles.option} ${styles.photo} ${cover.kind === 'photo' ? styles.selected : ''}`}
          aria-label={t.edit.photo}
          aria-pressed={cover.kind === 'photo'}
          onClick={() => setSheet(true)}
        >
          {cover.kind === 'photo' ? <Cover cover={cover} title={title} size="m" /> : <Icon name="plus" size={24} />}
        </button>
      </div>
      <Sheet open={sheet} onClose={() => setSheet(false)} title={t.edit.photoSheet}>
        <div className={styles.grid}>
          {PRESETS.map((p) => (
            <button
              key={p}
              className={styles.gridItem}
              aria-label={t.edit.photoN(p)}
              onClick={() => {
                onChange({ kind: 'photo', preset: p });
                setSheet(false);
              }}
            >
              <Cover cover={{ kind: 'photo', preset: p }} title={title} size="m" />
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}
