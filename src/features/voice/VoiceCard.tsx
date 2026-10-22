import { t } from '../../content/ru';
import { formatDay } from '../../i18n/format';
import styles from './voice.module.css';

/** Stimm-Karte: Qualität, aufgenommene Minuten, letzte Aktualisierung. */
export function VoiceCard({ quality, minutes, updatedAt }: { quality: number; minutes: number; updatedAt: string | null }) {
  return (
    <section className={styles.card}>
      <p className={styles.cardTitle}>{t.voice.yourVoice(quality)}</p>
      <div className={styles.quality} role="progressbar" aria-label={t.voice.quality} aria-valuemin={0} aria-valuemax={100} aria-valuenow={quality}>
        <span style={{ width: `${quality}%` }} />
      </div>
      <div className={styles.cardMeta}>
        <span>{t.voice.recorded(minutes)}</span>
        {updatedAt && <span>{t.voice.updated(formatDay(new Date(updatedAt), new Date()))}</span>}
      </div>
    </section>
  );
}
