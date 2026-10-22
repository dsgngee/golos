import { useState } from 'react';
import { useNav } from '../../app/navigation';
import { t, typeFilterLabel } from '../../content/ru';
import type { RecordingType } from '../../data/types';
import { selectRecordings, useLibrary } from '../../store/library';
import { Chip } from '../../ui/Chip';
import { EmptyState } from '../../ui/EmptyState';
import { Icon } from '../../ui/icons';
import { NavBar } from '../../ui/NavBar';
import { TextField } from '../../ui/TextField';
import { RecordingList } from './RecordingList';
import styles from './SearchScreen.module.css';
import { SortSheet, type SortKey } from './SortSheet';

const TYPES: (RecordingType | 'all')[] = ['all', 'book', 'article', 'language', 'tale', 'study'];

export function SearchScreen() {
  const recordings = useLibrary((s) => s.recordings);
  const folders = useLibrary((s) => s.folders);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<RecordingType | 'all'>('all');
  const [tag, setTag] = useState<string | undefined>();
  const [sort, setSort] = useState<SortKey>('recent');
  const [sortOpen, setSortOpen] = useState(false);

  const tags = [...new Set(recordings.flatMap((r) => r.tags))].sort((a, b) => a.localeCompare(b, 'ru'));
  const results = selectRecordings(recordings, { search, type, tag, sort });
  const reset = () => {
    setSearch('');
    setType('all');
    setTag(undefined);
  };

  return (
    <div>
      <NavBar title={t.search.title} onBack={() => useNav.getState().pop()} />
      <div className={styles.page}>
        <TextField label={t.search.field} hideLabel type="search" value={search} placeholder={t.search.placeholder} onChange={setSearch} />

        <div className={styles.scroller} role="group" aria-label={t.search.types}>
          {TYPES.map((k) => (
            <Chip key={k} selected={type === k} onClick={() => setType(k)}>
              {typeFilterLabel[k]}
            </Chip>
          ))}
        </div>

        <div>
          <p className={styles.label}>{t.search.folders}</p>
          <div className={styles.scroller}>
            {folders.map((f) => (
              <Chip key={f.id} onClick={() => useNav.getState().push({ name: 'library.folder', params: { folderId: f.id } })}>
                <Icon name="folder" size={16} />
                {f.name}
              </Chip>
            ))}
          </div>
        </div>

        {tags.length > 0 && (
          <div>
            <p className={styles.label}>{t.search.tags}</p>
            <div className={styles.scroller}>
              {tags.map((x) => (
                <Chip key={x} selected={tag === x} onClick={() => setTag(tag === x ? undefined : x)}>
                  #{x}
                </Chip>
              ))}
            </div>
          </div>
        )}

        <div className={styles.bar}>
          <span className={styles.found}>{t.search.found(results.length)}</span>
          <button className={styles.sort} aria-label={`${t.search.sort}: ${t.search.sortBy[sort]}`} onClick={() => setSortOpen(true)}>
            <Icon name="sort" size={18} />
            <span>{t.search.sortBy[sort]}</span>
          </button>
        </div>

        {results.length === 0 ? (
          <EmptyState title={t.search.noneTitle} body={t.search.noneBody} action={{ label: t.search.reset, onClick: reset }} />
        ) : (
          <RecordingList recordings={results} />
        )}
      </div>
      <SortSheet open={sortOpen} onClose={() => setSortOpen(false)} onSelect={setSort} />
    </div>
  );
}
