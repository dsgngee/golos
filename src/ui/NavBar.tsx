import type { ReactNode } from 'react';
import { t } from '../content/ru';
import { Icon } from './icons';
import styles from './NavBar.module.css';

interface Props {
  title?: string;
  onBack?(): void;
  right?: ReactNode;
}

export function NavBar({ title, onBack, right }: Props) {
  return (
    <header className={styles.bar}>
      <div className={styles.side}>
        {onBack && (
          <button className={styles.back} aria-label={t.common.back} onClick={onBack}>
            <Icon name="back" size={26} />
          </button>
        )}
      </div>
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={`${styles.side} ${styles.right}`}>{right}</div>
    </header>
  );
}
