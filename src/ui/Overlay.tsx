import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Overlay.module.css';

export const OVERLAY_ROOT_ID = 'overlay-root';

interface Props {
  open: boolean;
  onClose(): void;
  label?: string;
  variant: 'sheet' | 'actions';
  /** Nur für den Styleguide: statische Vorschau an Ort und Stelle, ohne Portal, Hintergrund und Dialog-Rolle. */
  inline?: boolean;
  children: ReactNode;
}

/** Gemeinsame Basis für Sheet und ActionSheet: Portal, Hintergrund, Escape. */
export function Overlay({ open, onClose, label, variant, inline, children }: Props) {
  useEffect(() => {
    if (!open || inline) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, inline, onClose]);

  if (!open) return null;
  if (inline) return <div className={`${styles.panel} ${styles[variant]} ${styles.inline}`}>{children}</div>;

  const host = document.getElementById(OVERLAY_ROOT_ID) ?? document.body;
  return createPortal(
    <div className={styles.layer}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label={label} className={`${styles.panel} ${styles[variant]}`}>
        {children}
      </div>
    </div>,
    host,
  );
}
