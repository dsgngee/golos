import { useState } from 'react';
import { useNav } from '../../app/navigation';
import type { ScreenProps } from '../../app/screens';
import { t } from '../../content/ru';
import { sessions } from '../../data/sessions';
import { useVoice } from '../../store/voice';
import { Button } from '../../ui/Button';
import { NavBar } from '../../ui/NavBar';
import { Recorder } from './Recorder';
import styles from './voice.module.css';

export function VoiceSessionScreen({ params }: ScreenProps) {
  const session = sessions.find((s) => s.id === params?.id);
  const quality = useVoice((s) => s.quality);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  if (!session) return null;
  const nav = useNav.getState();

  const finish = () => {
    useVoice.getState().finishSession(session.id);
    setDone(true);
  };

  return (
    <div className={styles.screen}>
      <NavBar title={session.title} onBack={() => nav.pop()} />
      <div className={styles.sessionBody}>
        {done ? (
          <div className={styles.result}>
            <h1 className={styles.resultTitle}>{t.voice.updatedTitle(quality)}</h1>
            <p className={styles.resultAsk}>{t.voice.revoiceAsk}</p>
            <p className={styles.cardBodyMuted}>{t.voice.revoiceBody}</p>
            <div className={styles.resultActions}>
              <Button onClick={() => nav.push({ name: 'voice.revoice' })}>{t.voice.choose}</Button>
              <Button variant="plain" onClick={() => nav.popToRoot('voice')}>
                {t.voice.notNow}
              </Button>
            </div>
          </div>
        ) : session.mode === 'free' ? (
          <Recorder mode="free" prompt={session.prompt ?? ''} onDone={finish} />
        ) : (
          <Recorder mode="phrases" phrases={session.phrases ?? []} index={index} onIndexChange={setIndex} onDone={finish} />
        )}
      </div>
    </div>
  );
}
