import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'filled' | 'plain' | 'destructive';
  trailing?: ReactNode;
  full?: boolean;
}

export function Button({ variant = 'filled', trailing, full = true, className, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`${styles.button} ${styles[variant]} ${full ? styles.full : ''} ${trailing ? styles.split : ''} ${className ?? ''}`}
    >
      <span className={styles.label}>{children}</span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </button>
  );
}
