import { useId } from 'react';
import styles from './Toggle.module.css';

interface Props {
  checked: boolean;
  onChange(v: boolean): void;
  label: string;
}

export function Toggle({ checked, onChange, label }: Props) {
  const id = useId();
  return (
    <div className={styles.row}>
      <span id={id} className={styles.label}>
        {label}
      </span>
      <button
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        className={`${styles.switch} ${checked ? styles.on : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.knob} />
      </button>
    </div>
  );
}
