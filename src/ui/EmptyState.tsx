import { Button } from './Button';
import styles from './EmptyState.module.css';

interface Props {
  title: string;
  body?: string;
  action?: { label: string; onClick(): void };
}

export function EmptyState({ title, body, action }: Props) {
  return (
    <section className={styles.empty}>
      <h2 className={styles.title}>{title}</h2>
      {body && <p className={styles.body}>{body}</p>}
      {action && (
        <Button variant="outline" onClick={action.onClick} full={false}>
          {action.label}
        </Button>
      )}
    </section>
  );
}
