import { useEffect, useRef, useState } from 'react';
import { t } from '../../content/ru';
import { formatClock } from '../../i18n/format';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/icons';
import { PrototypeHint } from '../../ui/PrototypeHint';
import { LevelMeter } from './LevelMeter';
import styles from './Recorder.module.css';

export const RECORD_MS = 2000;
export const FREE_MIN_SEC = 5;

type Props =
  | {
      mode: 'phrases';
      phrases: string[];
      index: number;
      onIndexChange(i: number): void;
      onDone(): void;
      forceTooQuietAt?: number;
      onPause?(): void;
    }
  | { mode: 'free'; prompt: string; onDone(): void };

export function Recorder(props: Props) {
  return props.mode === 'free' ? <FreeRecorder prompt={props.prompt} onDone={props.onDone} /> : <PhraseRecorder {...props} />;
}

function RecordButton({ recording, label, onClick }: { recording: boolean; label: string; onClick(): void }) {
  return (
    <button className={`${styles.record} ${recording ? styles.recording : ''}`} aria-label={label} onClick={onClick}>
      {recording ? <span className={styles.stopIcon} /> : <Icon name="mic" size={30} />}
    </button>
  );
}

function PhraseRecorder({ phrases, index, onIndexChange, onDone, forceTooQuietAt, onPause }: Extract<Props, { mode: 'phrases' }>) {
  const [state, setState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [tooQuiet, setTooQuiet] = useState(false);
  const warned = useRef(new Set<number>());
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    setState('idle');
    setTooQuiet(false);
  }, [index]);

  const stop = () => {
    clearTimeout(timer.current);
    if (index === forceTooQuietAt && !warned.current.has(index)) {
      warned.current.add(index);
      setTooQuiet(true);
      setState('idle');
    } else {
      setState('recorded');
    }
  };

  const start = () => {
    setTooQuiet(false);
    setState('recording');
    timer.current = setTimeout(stop, RECORD_MS);
  };

  const next = () => (index >= phrases.length - 1 ? onDone() : onIndexChange(index + 1));
  const status = state === 'recording' ? t.recorder.recordingNow : state === 'recorded' ? t.recorder.recorded : t.recorder.readAloud;

  return (
    <div className={styles.recorder}>
      <div className={styles.head}>
        <span className={styles.counter}>{t.recorder.phraseOf(index + 1, phrases.length)}</span>
        {onPause && (
          <button className={styles.pause} onClick={onPause}>
            {t.recorder.pause}
          </button>
        )}
      </div>
      <div className={styles.bar} aria-hidden="true">
        <span style={{ width: `${(index / phrases.length) * 100}%` }} />
      </div>

      <p className={styles.phrase}>{phrases[index]}</p>

      <div className={styles.center}>
        <p className={`${styles.status} ${tooQuiet ? styles.warning : ''}`} aria-live="polite">
          {tooQuiet ? t.recorder.tooQuiet : status}
        </p>
        <LevelMeter active={state === 'recording'} />
        <RecordButton recording={state === 'recording'} label={state === 'recording' ? t.recorder.stop : t.recorder.record} onClick={state === 'recording' ? stop : start} />
      </div>

      <div className={styles.actions}>
        {state === 'recorded' && (
          <Button variant="plain" full={false} onClick={() => setState('idle')}>
            {t.recorder.rerecord}
          </Button>
        )}
        <Button disabled={state !== 'recorded'} onClick={next}>
          {t.recorder.next}
        </Button>
        <PrototypeHint onClick={onDone}>{t.recorder.recordAll}</PrototypeHint>
      </div>
    </div>
  );
}

function FreeRecorder({ prompt, onDone }: { prompt: string; onDone(): void }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  return (
    <div className={styles.recorder}>
      <p className={styles.phrase}>{prompt}</p>
      <div className={styles.center}>
        <p className={styles.status}>{t.recorder.freeHint}</p>
        <p className={styles.clock}>{formatClock(seconds)}</p>
        <LevelMeter active={recording} />
      </div>
      <div className={styles.actions}>
        {recording ? (
          <Button disabled={seconds < FREE_MIN_SEC} onClick={onDone}>
            {t.recorder.freeStop}
          </Button>
        ) : (
          <Button onClick={() => setRecording(true)}>{t.recorder.freeStart}</Button>
        )}
        <PrototypeHint onClick={onDone}>{t.recorder.finishProto}</PrototypeHint>
      </div>
    </div>
  );
}
