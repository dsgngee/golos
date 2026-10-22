import { PrototypeMenu } from '../features/profile/PrototypeMenu';
import styles from './PrototypePanel.module.css';

/** Desktop: Szenario-Schalter neben dem iPhone-Rahmen (nur Präsentation, nicht Teil der App). */
export function PrototypePanel() {
  return (
    <div className={styles.panel}>
      <PrototypeMenu />
      <a className={styles.link} href="#styleguide">
        Styleguide
      </a>
    </div>
  );
}
