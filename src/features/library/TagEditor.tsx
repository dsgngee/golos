import { useState } from 'react';
import { t } from '../../content/ru';
import { cleanTags } from '../../store/library';
import { Icon } from '../../ui/icons';
import styles from './TagEditor.module.css';

interface Props {
  tags: string[];
  onChange(tags: string[]): void;
}

export function TagEditor({ tags, onChange }: Props) {
  const [input, setInput] = useState('');
  const add = () => {
    if (!input.trim()) return;
    onChange(cleanTags([...tags, input]));
    setInput('');
  };

  return (
    <div className={styles.editor}>
      <p className={styles.label}>{t.tags.label}</p>
      {tags.length > 0 && (
        <ul className={styles.tags}>
          {tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              <span>{tag}</span>
              <button aria-label={t.tags.remove(tag)} className={styles.remove} onClick={() => onChange(tags.filter((x) => x !== tag))}>
                <Icon name="close" size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.addRow}>
        <input
          className={styles.input}
          aria-label={t.tags.placeholder}
          placeholder={t.tags.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        />
        <button className={styles.addButton} onClick={add} disabled={!input.trim()}>
          {t.tags.add}
        </button>
      </div>
    </div>
  );
}
