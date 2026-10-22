import { useState } from 'react';
import { t } from '../../content/ru';
import { useLibrary } from '../../store/library';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/icons';
import { Sheet } from '../../ui/Sheet';
import { TextField } from '../../ui/TextField';
import styles from './FolderPicker.module.css';

interface Props {
  open: boolean;
  onClose(): void;
  value: string | null;
  onChange(folderId: string | null): void;
  inline?: boolean;
}

export function FolderPicker({ open, onClose, value, onChange, inline }: Props) {
  const folders = useLibrary((s) => s.folders);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const pick = (id: string | null) => {
    onChange(id);
    onClose();
  };

  const createFolder = () => {
    const folder = useLibrary.getState().createFolder(name);
    if (!folder) {
      setError(true);
      return;
    }
    setCreating(false);
    setName('');
    setError(false);
    pick(folder.id);
  };

  return (
    <Sheet open={open} onClose={onClose} title={t.folder.label} inline={inline}>
      <div className={styles.list}>
        {[{ id: null as string | null, name: t.folder.none }, ...folders].map((f) => (
          <button key={f.id ?? 'none'} className={styles.option} aria-pressed={value === f.id} onClick={() => pick(f.id)}>
            <Icon name="folder" size={20} />
            <span className={styles.name}>{f.name}</span>
            {value === f.id && <Icon name="check" size={20} />}
          </button>
        ))}
      </div>
      {creating ? (
        <div className={styles.create}>
          <TextField label={t.folder.newName} value={name} onChange={(v) => { setName(v); setError(false); }} />
          {error && <p className={styles.error}>{t.folder.exists}</p>}
          <Button disabled={!name.trim()} onClick={createFolder}>
            {t.folder.create}
          </Button>
        </div>
      ) : (
        <Button variant="plain" trailing="+" onClick={() => setCreating(true)}>
          {t.folder.new}
        </Button>
      )}
    </Sheet>
  );
}
