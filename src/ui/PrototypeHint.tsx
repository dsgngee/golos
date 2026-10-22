import type { ReactNode } from 'react';
import styles from './PrototypeHint.module.css';

/** Gestrichelt umrandete Abkürzung, die es nur im Prototyp gibt. */
export function PrototypeHint({ onClick, children }: { onClick(): void; children: ReactNode }) {
  return (
    <button className={styles.hint} onClick={onClick}>
      {children}
    </button>
  );
}
