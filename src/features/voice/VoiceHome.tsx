import { useEffect, useState } from 'react';
import { useNav } from '../../app/navigation';
import { styleName, t } from '../../content/ru';
import { sessions } from '../../data/sessions';
import type { ReadingStyle } from '../../data/types';
import { formatDay } from '../../i18n/format';
import { useVoice } from '../../store/voice';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/icons';
import { PlayButton } from '../../ui/PlayButton';
import styles from './voice.module.css';

const STYLE_SAMPLE_MS = 10_000;
const STYLES: ReadingStyle[] = ['normal', 'expressive', 'calm'];

function StyleSamples() {
  const [playing, setPlaying] = useState<ReadingStyle | null>(null);
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setPlaying(null), STYLE_SAMPLE_MS);
    return () => clearTimeout(id);
  }, [playing]);
  return (
    <section>
      <h2 className={styles.section}>{t.voice.styles}</h2>
      {STYLES.map((s) => (
        <div key={s} className={styles.styleRow}>
          <span className={styles.styleName}>{styleName[s]}</span>
          <PlayButton size="m" playing={playing === s} onToggle={() => setPlaying(playing === s ? null : s)} />
        </div>
      ))}
    </section>
  );
}

export function VoiceHome() {
  const v = useVoice();
  const nav = useNav.getState();

  return (
    <div className={styles.page}>
      <h1 className={styles.titleXL}>{t.voice.title}</h1>

      {v.status === 'none' ? (
        <section className={styles.card}>
          <p className={styles.cardTitle}>{t.voice.missingTitle}</p>
          <p className={styles.cardBody}>{t.voice.missingBody}</p>
          <Button variant="outline" className={styles.cardButton} onClick={() => v.startSetup()}>
            {t.voice.setup}
          </Button>
        </section>
      ) : (
        <section className={styles.card}>
          <p className={styles.cardTitle}>{t.voice.yourVoice(v.quality)}</p>
          <div className={styles.quality} role="progressbar" aria-label={t.voice.quality} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v.quality}>
            <span style={{ width: `${v.quality}%` }} />
          </div>
          <div className={styles.cardMeta}>
            <span>{t.voice.recorded(v.minutes)}</span>
            {v.updatedAt && <span>{t.voice.updated(formatDay(new Date(v.updatedAt), new Date()))}</span>}
          </div>
        </section>
      )}

      {v.status === 'ready' && (
        <section>
          <h2 className={styles.section}>{t.voice.improve}</h2>
          {sessions.map((s, i) => {
            const done = v.sessionsDone.includes(s.id);
            return (
              <button key={s.id} className={styles.session} onClick={() => nav.push({ name: 'voice.session', params: { id: s.id } })}>
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.sessionText}>
                  <span className={styles.sessionTitle}>{s.title}</span>
                  <span className={styles.sessionSub}>{s.subtitle}</span>
                </span>
                {done ? (
                  <span className={styles.done}>
                    <Icon name="check" size={16} />
                  </span>
                ) : (
                  <Icon name="chevronRight" size={18} />
                )}
              </button>
            );
          })}
        </section>
      )}

      <StyleSamples />
    </div>
  );
}
