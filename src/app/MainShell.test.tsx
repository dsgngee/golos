import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLibrary } from '../store/library';
import { usePlayer } from '../store/player';
import { useVoice } from '../store/voice';
import { MainShell } from './MainShell';
import { useNav } from './navigation';

beforeEach(() => {
  useLibrary.getState().reset();
  usePlayer.getState().reset();
  useNav.getState().reset();
  useVoice.setState({ onboardingDone: true, status: 'ready' });
});

test('search state survives push/pop', async () => {
  render(<MainShell />);
  act(() => useNav.getState().push({ name: 'library.search' }));
  await userEvent.type(screen.getByRole('searchbox', { name: 'Поиск' }), 'колобок');
  act(() => useNav.getState().push({ name: 'library.edit', params: { id: 'kolobok' } }));
  expect(screen.queryByRole('searchbox')).toBeNull();
  act(() => useNav.getState().pop());
  expect(screen.getByRole('searchbox', { name: 'Поиск' })).toHaveValue('колобок');
});

test('search state survives a tab switch', async () => {
  render(<MainShell />);
  act(() => useNav.getState().push({ name: 'library.search' }));
  await userEvent.type(screen.getByRole('searchbox', { name: 'Поиск' }), 'ёж');
  await userEvent.click(screen.getByRole('tab', { name: 'Голос' }));
  expect(screen.queryByRole('searchbox')).toBeNull();
  await userEvent.click(screen.getByRole('tab', { name: 'Библиотека' }));
  expect(screen.getByRole('searchbox', { name: 'Поиск' })).toHaveValue('ёж');
});

test('popped screens are discarded', async () => {
  render(<MainShell />);
  act(() => useNav.getState().push({ name: 'library.search' }));
  await userEvent.type(screen.getByRole('searchbox'), 'abc');
  act(() => useNav.getState().pop());
  act(() => useNav.getState().push({ name: 'library.search' }));
  expect(screen.getByRole('searchbox')).toHaveValue('');
});
