import { useEffect } from 'react';
import { t } from '../content/ru';
import { usePlayer } from '../store/player';
import { useUi } from '../store/ui';
import styles from './Banner.module.css';

export const BANNER_MS = 4000;

/** Darstellung des Banners (auch für den Styleguide). */
export function BannerView({ title, body, onPress, inline }: { title: string; body?: string; onPress(): void; inline?: boolean }) {
  return (
    <div className={inline ? styles.inlineWrap : styles.wrap} role="status">
      <button className={styles.banner} onClick={onPress}>
        <span className={styles.app}>{t.banner.app}</span>
        <span className={styles.title}>{title}</span>
        {body && <span className={styles.body}>{body}</span>}
      </button>
    </div>
  );
}

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
    <BannerView
      title={banner.title}
      body={banner.body}
      onPress={() => {
        if (banner.recordingId) usePlayer.getState().open(banner.recordingId, { expand: true });
        hide();
      }}
    />
  );
}
