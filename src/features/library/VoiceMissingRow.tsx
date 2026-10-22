import { t } from '../../content/ru';
import { useVoice } from '../../store/voice';
import { Icon } from '../../ui/icons';
import styles from './VoiceMissingRow.module.css';

export function VoiceMissingRow() {
  return (
    <button className={styles.row} onClick={() => useVoice.getState().startSetup()}>
      <Icon name="mic" size={20} />
      <span className={styles.text}>{t.library.voiceMissing}</span>
      <span className={styles.action}>{t.library.setup}</span>
    </button>
  );
}
