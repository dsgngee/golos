import type { ComponentType } from 'react';
import { GeneratingScreen } from '../features/create/GeneratingScreen';
import { OptionsScreen } from '../features/create/OptionsScreen';
import { ReviewScreen } from '../features/create/ReviewScreen';
import { SourceScreen } from '../features/create/SourceScreen';
import { FolderScreen } from '../features/library/FolderScreen';
import { LibraryHome } from '../features/library/LibraryHome';
import { SearchScreen } from '../features/library/SearchScreen';
import type { ScreenName } from './navigation';

export type ScreenProps = { params?: Record<string, string> };

export function Placeholder({ name }: { name: string }) {
  return (
    <div data-testid="placeholder" style={{ padding: 24 }}>
      {name}
    </div>
  );
}

const placeholder = (name: string): ComponentType<ScreenProps> =>
  function PlaceholderScreen() {
    return <Placeholder name={name} />;
  };

export const screens: Record<ScreenName, ComponentType<ScreenProps>> = {
  'library.home': LibraryHome,
  'library.search': SearchScreen,
  'library.folder': FolderScreen,
  'library.edit': placeholder('library.edit'),
  'create.source': SourceScreen,
  'create.review': ReviewScreen,
  'create.options': OptionsScreen,
  'create.generating': GeneratingScreen,
  'voice.home': placeholder('voice.home'),
  'voice.session': placeholder('voice.session'),
  'voice.revoice': placeholder('voice.revoice'),
  'profile.home': placeholder('profile.home'),
};
