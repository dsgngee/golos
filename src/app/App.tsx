import { useEffect, useSyncExternalStore } from 'react';
import { OnboardingFlow } from '../features/onboarding/OnboardingFlow';
import { Styleguide } from '../features/styleguide/Styleguide';
import { useVoice } from '../store/voice';
import styles from './App.module.css';
import { MainShell } from './MainShell';
import { PhoneFrame } from './PhoneFrame';
import { PrototypePanel } from './PrototypePanel';
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

  // Einfacher Anker (#styleguide) funktioniert auch als Deep-Link aus dem Artifact; #/styleguide bleibt gültig.
  const isStyleguide = hash === '#styleguide' || hash === '#/styleguide';
  // Der Styleguide ist hell; seine Boards setzen ihr Theme selbst. Sonst würde ein dunkles App-Theme
  // auf <html> über theme-spezifische Regeln in die hellen Boards durchschlagen.
  const documentTheme = isStyleguide ? 'light' : theme;

  useEffect(() => {
    document.documentElement.dataset.theme = documentTheme;
  }, [documentTheme]);

  if (isStyleguide) {
    return (
      <div data-testid="app-root" data-theme="light" className={styles.root}>
        <Styleguide />
      </div>
    );
  }

  const content = !onboardingDone || setupActive ? <OnboardingFlow /> : <MainShell />;

  return (
    <div data-testid="app-root" data-theme={theme} className={styles.root}>
      <PhoneFrame side={<PrototypePanel />}>{content}</PhoneFrame>
    </div>
  );
}
