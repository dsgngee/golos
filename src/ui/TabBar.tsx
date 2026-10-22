import { TABS, useNav, type TabId } from '../app/navigation';
import { t } from '../content/ru';
import { Icon, type IconName } from './icons';
import styles from './TabBar.module.css';

const icons: Record<TabId, IconName> = { library: 'library', create: 'plus', voice: 'mic', profile: 'user' };

export function TabBar() {
  const tab = useNav((s) => s.tab);
  const switchTab = useNav((s) => s.switchTab);
  return (
    <nav className={styles.dock} role="tablist" aria-label={t.tabs.label}>
      {TABS.map((id) => (
        <button
          key={id}
          role="tab"
          aria-selected={tab === id}
          className={`${styles.tab} ${tab === id ? styles.active : ''}`}
          onClick={() => switchTab(id)}
        >
          <Icon name={icons[id]} />
          <span className={styles.label}>{t.tabs[id]}</span>
        </button>
      ))}
    </nav>
  );
}
