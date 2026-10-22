import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { MiniPlayer } from './MiniPlayer';

beforeEach(() => {
  useLibrary.getState().reset();
  usePlayer.getState().reset();
});

test('mini player appears after opening and expands on tap', async () => {
  render(<MiniPlayer />);
  expect(screen.queryByTestId('mini-player')).toBeNull();
  act(() => usePlayer.getState().open('kolobok'));
  expect(screen.getByText('Колобок')).toBeInTheDocument();
  await userEvent.click(screen.getByTestId('mini-player'));
  expect(usePlayer.getState().expanded).toBe(true);
});

test('mini player play toggles without expanding', async () => {
  act(() => usePlayer.getState().open('metro'));
  render(<MiniPlayer />);
  await userEvent.click(screen.getByRole('button', { name: 'Воспроизвести' }));
  expect(usePlayer.getState()).toMatchObject({ isPlaying: true, expanded: false });
});
