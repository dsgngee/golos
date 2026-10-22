import { t } from '../../content/ru';
import type { LibraryQuery } from '../../store/library';
import { ActionSheet } from '../../ui/ActionSheet';

export type SortKey = NonNullable<LibraryQuery['sort']>;
const KEYS: SortKey[] = ['recent', 'title', 'duration'];

export function SortSheet({ open, onClose, onSelect }: { open: boolean; onClose(): void; onSelect(k: SortKey): void }) {
  return (
    <ActionSheet
      open={open}
      onClose={onClose}
      title={t.search.sort}
      actions={KEYS.map((k) => ({ label: t.search.sortBy[k], onSelect: () => onSelect(k) }))}
    />
  );
}
