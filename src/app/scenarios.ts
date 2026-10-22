import { t } from '../content/ru';
import { sampleLink } from '../data/samples';
import { emptyDraft, useDraft } from '../features/create/draft';
import { useGeneration } from '../store/generation';
import { useLibrary } from '../store/library';
import { usePlayer } from '../store/player';
import { useSettings } from '../store/settings';
import { useUi } from '../store/ui';
import { useVoice } from '../store/voice';
import { useNav } from './navigation';

export type ScenarioId = 'reset' | 'ready' | 'voiceMissing' | 'emptyLibrary' | 'generating' | 'tooQuiet' | 'readyBanner' | 'night';

export const SCENARIOS: readonly ScenarioId[] = [
  'reset',
  'ready',
  'voiceMissing',
  'emptyLibrary',
  'generating',
  'tooQuiet',
  'readyBanner',
  'night',
];

export const scenarioLabels: Record<ScenarioId, string> = t.prototype.scenarios;

/** Alle Inhalte zurück auf Anfang; Einstellungen bleiben (außer bei „reset“). */
function resetContent() {
  useLibrary.getState().reset();
  usePlayer.getState().reset();
  useGeneration.getState().reset();
  useNav.getState().reset();
  useUi.getState().hideBanner();
  useDraft.getState().resetDraft();
  useVoice.getState().reset();
}

function ready() {
  resetContent();
  const v = useVoice.getState();
  v.completeOnboarding();
  v.finishSetup();
}

export function runScenario(id: ScenarioId): void {
  switch (id) {
    case 'reset':
      resetContent();
      useSettings.getState().reset();
      return;
    case 'ready':
      ready();
      return;
    case 'voiceMissing':
      ready();
      useVoice.getState().deleteVoice();
      return;
    case 'emptyLibrary':
      ready();
      useLibrary.getState().clear();
      return;
    case 'generating': {
      ready();
      const recId = useGeneration.getState().start({
        ...emptyDraft(),
        source: 'link',
        type: 'article',
        text: sampleLink.text,
        simulatedWords: sampleLink.simulatedWords,
        title: sampleLink.title,
      });
      const nav = useNav.getState();
      nav.switchTab('create');
      nav.push({ name: 'create.generating', params: { id: recId } });
      return;
    }
    case 'tooQuiet': {
      ready();
      const v = useVoice.getState();
      v.startSetup();
      v.setSetupStep('record');
      v.setPhraseIndex(2);
      v.setForceTooQuiet(true);
      return;
    }
    case 'readyBanner': {
      ready();
      const rec = useLibrary.getState().recordings.find((r) => r.id === 'sensory');
      if (rec) useUi.getState().showBanner({ title: t.create.doneTitle, body: t.create.readyBody(rec.title), recordingId: rec.id });
      return;
    }
    case 'night':
      ready();
      usePlayer.getState().open('kolobok', { expand: true });
      return;
  }
}
