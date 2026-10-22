import { useState, type ReactNode } from 'react';
import { useNav } from '../../app/navigation';
import { t } from '../../content/ru';
import { RATES, type Rate, type SleepOption } from '../../data/types';
import { formatRate } from '../../i18n/format';
import { usePlayer } from '../../store/player';
import { useSettings, type SkipStep, type ThemeSetting } from '../../store/settings';
import { useVoice } from '../../store/voice';
import { ActionSheet } from '../../ui/ActionSheet';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/icons';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { Sheet } from '../../ui/Sheet';
import { TextField } from '../../ui/TextField';
import { Toggle } from '../../ui/Toggle';
import styles from './ProfileScreen.module.css';
import { PrototypeMenu } from './PrototypeMenu';

const THEMES: ThemeSetting[] = ['light', 'dark', 'system'];
const STEPS: SkipStep[] = [10, 15, 30];
const SLEEP: SleepOption[] = ['off', 15, 30, 45, 60];
const sleepLabel = (o: SleepOption) =>
  o === 'off' ? t.player.sleepOff : o === 'chapterEnd' ? t.player.chapterEnd : t.player.minutes(o);

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.group}>
      <h2 className={styles.groupTitle}>{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value, onClick, destructive }: { label: string; value?: string; onClick?(): void; destructive?: boolean }) {
  const content = (
    <>
      <span className={`${styles.rowLabel} ${destructive ? styles.destructive : ''}`}>{label}</span>
      {value && <span className={styles.rowValue}>{value}</span>}
      {onClick && !destructive && <Icon name="chevronRight" size={18} />}
    </>
  );
  return onClick ? (
    <button className={styles.row} onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className={styles.row}>{content}</div>
  );
}

export function ProfileScreen() {
  const s = useSettings();
  const [sheet, setSheet] = useState<'name' | 'rate' | 'sleep' | 'deleteVoice' | null>(null);
  const [name, setName] = useState(s.name);
  const close = () => setSheet(null);

  return (
    <div className={styles.page}>
      <h1 className={styles.titleXL}>{t.profile.title}</h1>

      <div className={styles.head}>
        <span className={styles.avatar} aria-hidden="true">
          {s.name.trim().charAt(0).toUpperCase()}
        </span>
        <span className={styles.name}>{s.name}</span>
        <Button
          variant="plain"
          full={false}
          onClick={() => {
            setName(s.name);
            setSheet('name');
          }}
        >
          {t.profile.editName}
        </Button>
      </div>

      <Group title={t.profile.appearance}>
        <SegmentedControl<ThemeSetting>
          ariaLabel={t.profile.appearance}
          value={s.theme}
          onChange={(v) => s.set('theme', v)}
          options={THEMES.map((v) => ({ value: v, label: t.profile.themes[v] }))}
        />
      </Group>

      <Group title={t.profile.playback}>
        <Row label={t.profile.defaultRate} value={formatRate(s.defaultRate)} onClick={() => setSheet('rate')} />
        <div className={styles.block}>
          <p className={styles.blockLabel}>{t.profile.skipStep}</p>
          <SegmentedControl<SkipStep>
            ariaLabel={t.profile.skipStep}
            value={s.skipStep}
            onChange={(v) => s.set('skipStep', v)}
            options={STEPS.map((v) => ({ value: v, label: t.profile.skipOption(v) }))}
          />
        </div>
        <Row label={t.profile.defaultSleep} value={sleepLabel(s.defaultSleep)} onClick={() => setSheet('sleep')} />
      </Group>

      <Group title={t.profile.notifications}>
        <Toggle label={t.profile.notifyReady} checked={s.notifyReady} onChange={(v) => s.set('notifyReady', v)} />
      </Group>

      <Group title={t.profile.voice}>
        <Row label={t.profile.manageVoice} onClick={() => useNav.getState().switchTab('voice')} />
        <Row label={t.profile.deleteVoice} destructive onClick={() => setSheet('deleteVoice')} />
      </Group>

      <Group title={t.profile.storage}>
        <Row label={t.profile.offline} value={t.profile.offlineValue} />
      </Group>

      <Group title={t.profile.about}>
        <Row label={t.profile.version} value={t.profile.versionValue} />
      </Group>

      <PrototypeMenu />

      <Sheet open={sheet === 'name'} onClose={close} title={t.profile.nameLabel}>
        <div className={styles.sheetStack}>
          <TextField label={t.profile.nameLabel} hideLabel value={name} onChange={setName} />
          <Button
            disabled={!name.trim()}
            onClick={() => {
              s.set('name', name.trim());
              close();
            }}
          >
            {t.profile.save}
          </Button>
        </div>
      </Sheet>

      <Sheet open={sheet === 'rate'} onClose={close} title={t.profile.defaultRate}>
        <SegmentedControl<Rate>
          ariaLabel={t.profile.defaultRate}
          value={s.defaultRate}
          onChange={(r) => {
            s.set('defaultRate', r);
            usePlayer.getState().setRate(r);
          }}
          options={RATES.map((r) => ({ value: r, label: formatRate(r) }))}
        />
      </Sheet>

      <ActionSheet
        open={sheet === 'sleep'}
        onClose={close}
        title={t.profile.defaultSleep}
        actions={SLEEP.map((o) => ({ label: sleepLabel(o), onSelect: () => s.set('defaultSleep', o) }))}
      />

      <ActionSheet
        open={sheet === 'deleteVoice'}
        onClose={close}
        title={t.profile.deleteVoiceTitle}
        message={t.profile.deleteVoiceBody}
        actions={[{ label: t.profile.deleteVoiceConfirm, destructive: true, onSelect: () => useVoice.getState().deleteVoice() }]}
      />
    </div>
  );
}
