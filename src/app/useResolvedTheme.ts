import { useSettings } from '../store/settings';
import { useMediaQuery } from './useIsPhone';

export function useResolvedTheme(): 'light' | 'dark' {
  const theme = useSettings((s) => s.theme);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  if (theme === 'system') return prefersDark ? 'dark' : 'light';
  return theme;
}
