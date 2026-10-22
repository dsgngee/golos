import type { ReactNode } from 'react';
import { OVERLAY_ROOT_ID } from '../ui/Overlay';
import styles from './PhoneFrame.module.css';
import { useIsPhone } from './useIsPhone';

interface Props {
  children: ReactNode;
  side?: ReactNode;
}

export function PhoneFrame({ children, side }: Props) {
  const isPhone = useIsPhone();
  const screen = (
    <div className={styles.screen}>
      {children}
      <div id={OVERLAY_ROOT_ID} className={styles.overlayRoot} />
    </div>
  );

  if (isPhone) return <div className={styles.full}>{screen}</div>;

  return (
    <div className={styles.stage}>
      <div className={styles.device} data-testid="phone-frame">
        <div className={styles.statusBar} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.island} />
          <span className={styles.battery} />
        </div>
        {screen}
      </div>
      {side && <aside className={styles.side}>{side}</aside>}
    </div>
  );
}
