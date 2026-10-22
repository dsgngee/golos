import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNav } from '../../app/navigation';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { top } from '../../test/helpers';
import { FolderScreen } from './FolderScreen';
import { SearchScreen } from './SearchScreen';

beforeEach(() => {
  useLibrary.getState().reset();
  usePlayer.getState().reset();
  useNav.getState().reset();
});

test('search narrows the list with ё-insensitive matching', async () => {
  render(<SearchScreen />);
  await userEvent.type(screen.getByRole('searchbox', { name: 'Поиск' }), 'ЕЖИК');
  expect(screen.getByText('Ёжик и звёзды')).toBeInTheDocument();
  expect(screen.queryByText('Колобок')).toBeNull();
});

test('type chip filters', async () => {
  render(<SearchScreen />);
  await userEvent.click(screen.getByRole('button', { name: 'Сказки' }));
  const rows = screen.getAllByTestId('recording-row');
  expect(rows.length).toBe(useLibrary.getState().recordings.filter((r) => r.type === 'tale').length);
  expect(rows.every((r) => within(r).queryByText('Сказка') || r.textContent?.includes('Прослушано'))).toBe(true);
});

test('sort sheet switches to title order', async () => {
  render(<SearchScreen />);
  await userEvent.click(screen.getByRole('button', { name: /Сортировка/ }));
  await userEvent.click(screen.getByRole('button', { name: 'По названию' }));
  const titles = screen.getAllByTestId('recording-row').map((r) => r.querySelector('[class*="title"]')?.textContent ?? '');
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'ru')));
});

test('no results shows reset action that clears filters', async () => {
  render(<SearchScreen />);
  await userEvent.type(screen.getByRole('searchbox'), 'zzzz');
  expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));
  expect(screen.getAllByTestId('recording-row')).toHaveLength(24);
});

test('folder chip opens folder screen', async () => {
  render(<SearchScreen />);
  await userEvent.click(screen.getByRole('button', { name: 'Китайский' }));
  expect(top('library')).toBe('library.folder');
});

test('folder screen lists its recordings', () => {
  render(<FolderScreen params={{ folderId: 'tales' }} />);
  expect(screen.getByRole('heading', { name: 'Сказки на ночь' })).toBeInTheDocument();
  expect(screen.getByText('Колобок')).toBeInTheDocument();
});

test('empty folder state', () => {
  const folder = useLibrary.getState().createFolder('Подкасты')!;
  render(<FolderScreen params={{ folderId: folder.id }} />);
  expect(screen.getByText('В этой папке пока пусто')).toBeInTheDocument();
});
