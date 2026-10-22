import type { ReactNode } from 'react';
import styles from './icons.module.css';

export type IconName =
  | 'library'
  | 'plus'
  | 'mic'
  | 'user'
  | 'search'
  | 'more'
  | 'back'
  | 'chevronDown'
  | 'chevronRight'
  | 'moon'
  | 'timer'
  | 'chapters'
  | 'text'
  | 'check'
  | 'close'
  | 'folder'
  | 'tag'
  | 'play'
  | 'pause'
  | 'speed'
  | 'file'
  | 'link'
  | 'paste'
  | 'sort';

const filled = { fill: 'currentColor', stroke: 'none' } as const;

const paths: Record<IconName, ReactNode> = {
  library: <path d="M5 4v16M10 4v16M15 5l4 15" />,
  plus: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  more: (
    <>
      <circle cx="5.5" cy="12" r="1.4" {...filled} />
      <circle cx="12" cy="12" r="1.4" {...filled} />
      <circle cx="18.5" cy="12" r="1.4" {...filled} />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9.5 2.5h5" />
    </>
  ),
  chapters: <path d="M4 6h16M4 12h16M4 18h10" />,
  text: <path d="M5 6h14M5 10h14M5 14h14M5 18h8" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  folder: <path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />,
  tag: (
    <>
      <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3-8.7 8.7z" />
      <circle cx="8" cy="8" r="1.4" />
    </>
  ),
  play: <path d="M7 4v16l13-8z" {...filled} />,
  pause: (
    <>
      <rect x="6" y="4.5" width="4" height="15" rx="1" {...filled} />
      <rect x="14" y="4.5" width="4" height="15" rx="1" {...filled} />
    </>
  ),
  speed: (
    <>
      <path d="M4.5 17a8.5 8.5 0 1 1 15 0" />
      <path d="M12 13l4-5" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  paste: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1M9 10h6M9 14h6" />
    </>
  ),
  sort: <path d="M7 4v16M4 17l3 3 3-3M17 20V4M14 7l3-3 3 3" />,
};

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" className={styles.icon}>
      {paths[name]}
    </svg>
  );
}
