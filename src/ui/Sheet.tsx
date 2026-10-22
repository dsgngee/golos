import type { ReactNode } from 'react';
import { Overlay } from './Overlay';
import styles from './Sheet.module.css';

interface Props {
  open: boolean;
  onClose(): void;
  title?: string;
  children: ReactNode;
}

export function Sheet({ open, onClose, title, children }: Props) {
  return (
    <Overlay open={open} onClose={onClose} label={title} variant="sheet">
      <div className={styles.grabber} aria-hidden="true" />
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.body}>{children}</div>
    </Overlay>
  );
}
