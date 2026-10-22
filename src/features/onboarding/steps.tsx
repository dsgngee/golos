import { useEffect, useState, type ReactNode } from 'react';
import { t } from '../../content/ru';
import { formatClock, formatRemaining } from '../../i18n/format';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/icons';
import { NavBar } from '../../ui/NavBar';
import { PlayButton } from '../../ui/PlayButton';
import { ProgressLine } from '../../ui/ProgressLine';
import styles from './onboarding.module.css';

export const CREATING_MS = 4000;
const SAMPLE_SEC = 20;

function Step({ onBack, children, cta }: { onBack?(): void; children: ReactNode; cta?: ReactNode }) {
  return (
    <div className={styles.step}>
      {onBack ? <NavBar onBack={onBack} /> : <div className={styles.navSpace} />}
      <div className={styles.body}>{children}</div>
      {cta && <div className={styles.cta}>{cta}</div>}
    </div>
  );
}

export function Welcome({ onStart, onLater }: { onStart(): void; onLater(): void }) {
  return (
    <Step
      cta={
        <>
          <Button onClick={onStart}>{t.onboarding.start}</Button>
          <Button variant="plain" onClick={onLater}>
            {t.onboarding.later}
          </Button>
        </>
      }
    >
      <p className={styles.brand}>{t.onboarding.brand}</p>
      <h1 className={styles.hero}>{t.onboarding.welcomeTitle}</h1>
      <p className={styles.lead}>{t.onboarding.welcomeBody}</p>
    </Step>
  );
}

export function Expectation({ onBack, onNext }: { onBack(): void; onNext(): void }) {
  return (
    <Step onBack={onBack} cta={<Button onClick={onNext}>{t.onboarding.understood}</Button>}>
      <h1 className={styles.title}>{t.onboarding.expectTitle}</h1>
      <p className={styles.lead}>{t.onboarding.expectBody}</p>
    </Step>
  );
}

export function Prepare({ onBack, onNext }: { onBack(): void; onNext(): void }) {
  return (
    <Step onBack={onBack} cta={<Button onClick={onNext}>{t.onboarding.startRecording}</Button>}>
      <h1 className={styles.title}>{t.onboarding.prepareTitle}</h1>
      <ol className={styles.list}>
        {t.onboarding.prepareItems.map((item, i) => (
          <li key={item}>
            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
            {item}
          </li>
        ))}
      </ol>
    </Step>
  );
}

export function RecordStep({ onBack, children }: { onBack(): void; children: ReactNode }) {
  return <Step onBack={onBack}>{children}</Step>;
}

export function QualityCheck({ onBack, onNext }: { onBack(): void; onNext(): void }) {
  return (
    <Step onBack={onBack} cta={<Button onClick={onNext}>{t.onboarding.createVoice}</Button>}>
      <h1 className={styles.title}>{t.onboarding.qualityTitle}</h1>
      <ul className={styles.checks}>
        {t.onboarding.qualityChecks.map((c) => (
          <li key={c}>
            <span className={styles.check}>
              <Icon name="check" size={18} />
            </span>
            {c}
          </li>
        ))}
      </ul>
    </Step>
  );
}

export function Creating({ onDone }: { onDone(): void }) {
  useEffect(() => {
    const id = setTimeout(onDone, CREATING_MS);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <Step>
      <h1 className={styles.title}>{t.onboarding.creating}</h1>
      <p className={styles.lead}>{t.onboarding.creatingBody}</p>
      <div className={styles.creatingBar} aria-hidden="true">
        <span style={{ animationDuration: `${CREATING_MS}ms` }} />
      </div>
    </Step>
  );
}

export function FirstSample({ onFirstText, onLibrary }: { onFirstText(): void; onLibrary(): void }) {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setPos((p) => {
        if (p + 0.25 >= SAMPLE_SEC) {
          setPlaying(false);
          return SAMPLE_SEC;
        }
        return p + 0.25;
      });
    }, 250);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <Step
      cta={
        <>
          <Button onClick={onFirstText}>{t.onboarding.firstText}</Button>
          <Button variant="outline" onClick={onLibrary}>
            {t.onboarding.toLibrary}
          </Button>
        </>
      }
    >
      <h1 className={styles.title}>{t.onboarding.sampleTitle}</h1>
      <div className={styles.sample}>
        <PlayButton
          playing={playing}
          onToggle={() => {
            if (pos >= SAMPLE_SEC) setPos(0);
            setPlaying(!playing);
          }}
        />
        <div className={styles.sampleLine}>
          <ProgressLine valueSec={pos} max={SAMPLE_SEC} onSeek={setPos} />
          <div className={styles.times}>
            <span>{formatClock(pos)}</span>
            <span>{formatRemaining(SAMPLE_SEC - pos)}</span>
          </div>
        </div>
      </div>
      <p className={styles.hint}>{t.onboarding.sampleHint}</p>
    </Step>
  );
}
