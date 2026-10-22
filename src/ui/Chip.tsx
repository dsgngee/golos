import type { ReactNode } from 'react';
import styles from './Chip.module.css';

interface Props {
  selected?: boolean;
  onClick(): void;
  children: ReactNode;
}

export function Chip({ selected = false, onClick, children }: Props) {
  return (
    <button className={`${styles.chip} ${selected ? styles.selected : ''}`} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  );
}
