import { t } from '../content/ru';
import { Overlay } from './Overlay';
import styles from './ActionSheet.module.css';

export interface SheetAction {
  label: string;
  onSelect(): void;
  destructive?: boolean;
}

interface Props {
  open: boolean;
  onClose(): void;
  title?: string;
  message?: string;
  actions: SheetAction[];
}

export function ActionSheet({ open, onClose, title, message, actions }: Props) {
  return (
    <Overlay open={open} onClose={onClose} label={title ?? message} variant="actions">
      <div className={styles.group}>
        {(title || message) && (
          <div className={styles.head}>
            {title && <p className={styles.title}>{title}</p>}
            {message && <p className={styles.message}>{message}</p>}
          </div>
        )}
        {actions.map((a) => (
          <button
            key={a.label}
            className={`${styles.action} ${a.destructive ? styles.destructive : ''}`}
            onClick={() => {
              a.onSelect();
              onClose();
            }}
          >
            {a.label}
          </button>
        ))}
      </div>
      <button className={`${styles.group} ${styles.action} ${styles.cancel}`} onClick={onClose}>
        {t.common.cancel}
      </button>
    </Overlay>
  );
}
