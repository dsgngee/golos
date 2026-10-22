import { t } from '../../content/ru';
import { RATES, type Rate } from '../../data/types';
import { formatRate } from '../../i18n/format';
import { usePlayer } from '../../store/player';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { Sheet } from '../../ui/Sheet';

export function TempoSheet({ open, onClose }: { open: boolean; onClose(): void }) {
  const rate = usePlayer((s) => s.rate);
  return (
    <Sheet open={open} onClose={onClose} title={t.player.speed}>
      <SegmentedControl<Rate>
        ariaLabel={t.player.speed}
        value={rate}
        onChange={(r) => usePlayer.getState().setRate(r)}
        options={RATES.map((r) => ({ value: r, label: formatRate(r) }))}
      />
    </Sheet>
  );
}
