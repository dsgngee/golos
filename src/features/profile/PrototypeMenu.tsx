import { SCENARIOS, runScenario, scenarioLabels } from '../../app/scenarios';
import { t } from '../../content/ru';
import styles from './PrototypeMenu.module.css';

/** Nur im Prototyp: Zurücksetzen und Sprünge in Szenarien, damit jeder Ablauf wiederholbar ist. */
export function PrototypeMenu() {
  return (
    <section className={styles.menu} aria-label={t.prototype.title}>
      <h2 className={styles.title}>{t.prototype.title}</h2>
      <p className={styles.note}>{t.prototype.note}</p>
      <div className={styles.buttons}>
        {SCENARIOS.map((id) => (
          <button key={id} className={styles.button} onClick={() => runScenario(id)}>
            {scenarioLabels[id]}
          </button>
        ))}
      </div>
    </section>
  );
}
