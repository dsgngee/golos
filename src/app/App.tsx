import { useEffect, useSyncExternalStore } from 'react';
import { Styleguide } from '../features/styleguide/Styleguide';
import { useVoice } from '../store/voice';
import styles from './App.module.css';
import { MainShell } from './MainShell';
import { PhoneFrame } from './PhoneFrame';
import { Placeholder } from './screens';
import { useResolvedTheme } from './useResolvedTheme';

function useHash(): string {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener('hashchange', onChange);
      return () => window.removeEventListener('hashchange', onChange);
    },
    () => window.location.hash,
  );
}

export default function App() {
  const theme = useResolvedTheme();
  const hash = useHash();
  const onboardingDone = useVoice((s) => s.onboardingDone);
  const setupActive = useVoice((s) => s.setupActive);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  if (hash === '#/styleguide') {
    return (
      <div data-testid="app-root" data-theme={theme} className={styles.root}>
        <Styleguide />
      </div>
    );
  }

  const content = !onboardingDone || setupActive ? <Placeholder name="onboarding" /> : <MainShell />;

  return (
    <div data-testid="app-root" data-theme={theme} className={styles.root}>
      <PhoneFrame>{content}</PhoneFrame>
    </div>
  );
}
