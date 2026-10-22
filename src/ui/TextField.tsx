import { useId } from 'react';
import styles from './TextField.module.css';

interface Props {
  label: string;
  value: string;
  onChange(v: string): void;
  placeholder?: string;
  multiline?: boolean;
  type?: 'text' | 'search' | 'url';
  hideLabel?: boolean;
  rows?: number;
}

export function TextField({ label, value, onChange, placeholder, multiline, type = 'text', hideLabel, rows = 8 }: Props) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={hideLabel ? styles.hidden : styles.label}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className={`${styles.input} ${styles.area}`}
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={styles.input}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
