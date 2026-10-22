import { useState } from 'react';
import { useNav } from '../../app/navigation';
import { t, typeLabel } from '../../content/ru';
import { useGeneration } from '../../store/generation';
import { statusOf, useLibrary } from '../../store/library';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/icons';
import { NavBar } from '../../ui/NavBar';
import styles from './voice.module.css';

export function RevoiceScreen() {
  const recordings = useLibrary((s) => s.recordings).filter((r) => statusOf(r) !== 'generating');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const nav = useNav.getState();

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <div className={styles.screen}>
      <NavBar title={t.voice.revoiceTitle} onBack={() => nav.pop()} />
      <div className={styles.page}>
        <Button variant="plain" full={false} className={styles.selectAll} onClick={() => setSelected(new Set(recordings.map((r) => r.id)))}>
          {t.voice.selectAll}
        </Button>
        <div>
          {recordings.map((r) => {
            const checked = selected.has(r.id);
            return (
              <button key={r.id} role="checkbox" aria-checked={checked} className={styles.check} onClick={() => toggle(r.id)}>
                <span className={`${styles.box} ${checked ? styles.boxOn : ''}`}>{checked && <Icon name="check" size={16} />}</span>
                <span className={styles.sessionText}>
                  <span className={styles.sessionTitle}>{r.title}</span>
                  <span className={styles.sessionSub}>{r.meta ?? typeLabel[r.type]}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className={styles.stickyCta}>
          <Button
            disabled={selected.size === 0}
            onClick={() => {
              selected.forEach((id) => useGeneration.getState().revoice(id));
              nav.popToRoot('voice');
            }}
          >
            {t.voice.revoiceCta(selected.size)}
          </Button>
        </div>
      </div>
    </div>
  );
}
