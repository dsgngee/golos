import { useCallback } from 'react';
import { useNav } from '../../app/navigation';
import { phrases } from '../../data/phrases';
import { useVoice } from '../../store/voice';
import { Recorder } from '../voice/Recorder';
import { Creating, Expectation, FirstSample, Prepare, QualityCheck, RecordStep, Welcome } from './steps';

const FORCE_TOO_QUIET_AT = 2;

export function OnboardingFlow() {
  const step = useVoice((s) => s.setupStep);
  const phraseIndex = useVoice((s) => s.phraseIndex);
  // Bereits abgeschlossenes Onboarding = Einrichtung wurde aus der App heraus gestartet.
  const fromApp = useVoice((s) => s.onboardingDone);
  const v = useVoice.getState();

  const finishCreating = useCallback(() => {
    const s = useVoice.getState();
    s.finishSetup();
    s.setSetupStep('sample');
  }, []);

  const leave = (tab: 'library' | 'create') => {
    useVoice.getState().completeOnboarding();
    useNav.getState().switchTab(tab);
  };

  switch (step) {
    case 'welcome':
      return <Welcome onStart={() => v.setSetupStep('expectation')} onLater={() => v.completeOnboarding()} />;
    case 'expectation':
      return <Expectation onBack={() => v.setSetupStep('welcome')} onNext={() => v.setSetupStep('prepare')} />;
    case 'prepare':
      return (
        <Prepare
          onBack={() => (fromApp ? v.completeOnboarding() : v.setSetupStep('expectation'))}
          onNext={() => v.setSetupStep('record')}
        />
      );
    case 'record':
      return (
        <RecordStep onBack={() => v.setSetupStep('prepare')}>
          <Recorder
            mode="phrases"
            phrases={phrases}
            index={phraseIndex}
            onIndexChange={v.setPhraseIndex}
            onDone={() => v.setSetupStep('quality')}
            onPause={() => v.setSetupStep('prepare')}
            forceTooQuietAt={FORCE_TOO_QUIET_AT}
          />
        </RecordStep>
      );
    case 'quality':
      return <QualityCheck onBack={() => v.setSetupStep('record')} onNext={() => v.setSetupStep('creating')} />;
    case 'creating':
      return <Creating onDone={finishCreating} />;
    case 'sample':
      return <FirstSample onFirstText={() => leave('create')} onLibrary={() => leave('library')} />;
  }
}
