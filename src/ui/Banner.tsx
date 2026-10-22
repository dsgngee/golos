import { useEffect } from 'react';
import { t } from '../content/ru';
import { usePlayer } from '../store/player';
import { useUi } from '../store/ui';
import styles from './Banner.module.css';

export const BANNER_MS = 4000;

export function Banner() {
  const banner = useUi((s) => s.banner);
  const hide = useUi((s) => s.hideBanner);

  useEffect(() => {
    if (!banner) return;
    const id = setTimeout(hide, BANNER_MS);
    return () => clearTimeout(id);
  }, [banner, hide]);

  if (!banner) return null;
  return (
    <div className={styles.wrap} role="status">
      <button
        className={styles.banner}
        onClick={() => {
          if (banner.recordingId) usePlayer.getState().open(banner.recordingId, { expand: true });
          hide();
        }}
      >
        <span className={styles.app}>{t.banner.app}</span>
        <span className={styles.title}>{banner.title}</span>
        {banner.body && <span className={styles.body}>{banner.body}</span>}
      </button>
    </div>
  );
}
