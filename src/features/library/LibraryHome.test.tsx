import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNav } from '../../app/navigation';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { useSettings } from '../../store/settings';
import { useVoice } from '../../store/voice';
import { top } from '../../test/helpers';
import { LibraryHome } from './LibraryHome';

beforeEach(() => {
  useLibrary.getState().reset();
  useSettings.getState().reset();
  usePlayer.getState().reset();
  useNav.getState().reset();
  useVoice.setState({ onboardingDone: true, status: 'ready' });
});

test('home shows count and continue card with times', () => {
  render(<LibraryHome />);
  expect(screen.getByText('24 записи')).toBeInTheDocument();
  expect(screen.getByText('В метро: диалог')).toBeInTheDocument();
  expect(screen.getByText('12:41')).toBeInTheDocument();
  expect(screen.getByText('−05:39')).toBeInTheDocument();
});

test('skip back uses settings step', async () => {
  render(<LibraryHome />);
  await userEvent.click(screen.getByRole('button', { name: 'Назад на 15 секунд' }));
  expect(screen.getByText('12:26')).toBeInTheDocument();
});

test('play on the card starts the continue recording', async () => {
  render(<LibraryHome />);
  await userEvent.click(screen.getByRole('button', { name: 'Воспроизвести' }));
  expect(usePlayer.getState()).toMatchObject({ currentId: 'metro', isPlaying: true });
});

test('recent list excludes the continue item and opens rows', async () => {
  render(<LibraryHome />);
  const rows = screen.getAllByTestId('recording-row');
  expect(rows).toHaveLength(5);
  expect(rows.some((r) => r.textContent?.includes('В метро: диалог'))).toBe(false);
});

test('all recordings and search push the search screen', async () => {
  render(<LibraryHome />);
  await userEvent.click(screen.getByRole('button', { name: 'Все записи' }));
  expect(top('library')).toBe('library.search');
});

test('create button switches to the create tab', async () => {
  render(<LibraryHome />);
  await userEvent.click(screen.getByRole('button', { name: /Озвучить текст/ }));
  expect(useNav.getState().tab).toBe('create');
});

test('empty library shows empty state', () => {
  useLibrary.getState().clear();
  render(<LibraryHome />);
  expect(screen.getByText('Здесь появятся ваши записи')).toBeInTheDocument();
});

test('missing voice hint starts setup', async () => {
  useVoice.setState({ status: 'none' });
  render(<LibraryHome />);
  expect(screen.getByText('Голос ещё не настроен')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /Настроить/ }));
  expect(useVoice.getState().setupActive).toBe(true);
});
