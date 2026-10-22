import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { useSettings } from '../../store/settings';
import { NightPlayer } from './NightPlayer';

beforeEach(() => {
  useLibrary.getState().reset();
  useSettings.getState().reset();
  usePlayer.getState().reset();
});

test('opening a tale shows the night player with 30:00', () => {
  act(() => usePlayer.getState().open('kolobok', { expand: true }));
  render(<NightPlayer />);
  expect(screen.getByTestId('night-player')).toHaveAttribute('data-theme', 'night');
  expect(screen.getByText('30:00')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Колобок' })).toBeInTheDocument();
});

test('quick timer chips set the sleep timer, off shows hint', async () => {
  act(() => usePlayer.getState().open('kolobok', { expand: true }));
  render(<NightPlayer />);
  await userEvent.click(screen.getByRole('button', { name: '45 мин' }));
  expect(screen.getByText('45:00')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Выкл' }));
  expect(screen.getByText('Таймер выключен')).toBeInTheDocument();
});

test('fade hint under one minute', () => {
  act(() => {
    usePlayer.getState().open('kolobok', { expand: true });
    usePlayer.setState({ sleep: { option: 15, remainingMs: 50_000 } });
  });
  render(<NightPlayer />);
  expect(screen.getByText('Звук плавно затихает…')).toBeInTheDocument();
});

test('exit button leaves night mode', async () => {
  act(() => usePlayer.getState().open('kolobok', { expand: true }));
  render(<NightPlayer />);
  await userEvent.click(screen.getByRole('button', { name: 'Выйти из ночного режима' }));
  expect(usePlayer.getState().nightMode).toBe(false);
  expect(usePlayer.getState().expanded).toBe(true);
});
