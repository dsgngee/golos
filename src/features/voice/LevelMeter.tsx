import styles from './LevelMeter.module.css';

const HEIGHTS = [6, 10, 16, 12, 22, 18, 28, 20, 34, 24, 30, 38, 26, 32, 22, 36, 28, 18, 30, 20, 14, 22, 12, 8];

/** Simulierter Aufnahmepegel. */
export function LevelMeter({ active }: { active: boolean }) {
  return (
    <div className={`${styles.meter} ${active ? styles.active : ''}`} aria-hidden="true">
      {HEIGHTS.map((h, i) => (
        <i key={i} style={{ height: active ? h : 4, animationDelay: `${(i % 6) * 90}ms` }} />
      ))}
    </div>
  );
}
