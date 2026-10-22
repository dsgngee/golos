import type { Cover as CoverData } from '../data/types';
import { coverMotifs } from '../design/tokens';
import styles from './Cover.module.css';

interface Props {
  cover: CoverData;
  title: string;
  size: 's' | 'm' | 'l';
}

export function Cover({ cover, title, size }: Props) {
  if (cover.kind === 'photo') {
    const [base, shape] = coverMotifs[cover.preset - 1];
    return (
      <div className={`${styles.cover} ${styles[size]} ${styles.photo}`} style={{ background: base }} aria-hidden="true">
        <span className={`${styles.shape} ${styles[`shape${cover.preset}`]}`} style={{ background: shape }} />
      </div>
    );
  }
  return (
    <div className={`${styles.cover} ${styles[size]} ${styles[cover.tone]}`} aria-hidden="true">
      {cover.glyph ?? title.trim().charAt(0).toUpperCase()}
    </div>
  );
}
