import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { useSettings } from '../../store/settings';
import { lib } from '../../test/helpers';
import { FullPlayer } from './FullPlayer';
import { currentSentenceIndex, splitSentences } from './sentences';

// openExpanded(id): testlokal – Aufnahme im Vollbild öffnen
const openExpanded = (id: string) => act(() => usePlayer.getState().open(id, { expand: true }));

beforeEach(() => {
  useLibrary.getState().reset();
  useSettings.getState().reset();
  usePlayer.getState().reset();
});

test('shows title, times and controls', () => {
  openExpanded('metro');
  render(<FullPlayer />);
  expect(screen.getByRole('heading', { name: 'В метро: диалог' })).toBeInTheDocument();
  expect(screen.getByText('12:41')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Назад на 15 секунд' })).toBeInTheDocument();
});

test('tempo sheet sets rate and label uses comma', async () => {
  openExpanded('metro');
  render(<FullPlayer />);
  await userEvent.click(screen.getByRole('button', { name: /Скорость/ }));
  await userEvent.click(screen.getByRole('radio', { name: '1,5×' }));
  expect(usePlayer.getState().rate).toBe(1.5);
  expect(screen.getByRole('button', { name: /1,5×/ })).toBeInTheDocument();
});

test('chapter-end option only with chapters', async () => {
  openExpanded('metro');
  render(<FullPlayer />);
  await userEvent.click(screen.getByRole('button', { name: /Таймер/ }));
  expect(screen.queryByText('До конца главы')).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: '30 мин' }));
  expect(usePlayer.getState().sleep.option).toBe(30);
  expect(screen.getByRole('button', { name: /Таймер.*30:00/ })).toBeInTheDocument();
});

test('chapters sheet seeks', async () => {
  openExpanded('psychology');
  render(<FullPlayer />);
  expect(screen.getByText('Глава 2. Язык тела')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /Главы/ }));
  await userEvent.click(screen.getAllByRole('button', { name: /Глава 3/ })[0]);
  expect(lib('psychology').positionSec).toBe(lib('psychology').chapters![2].startSec);
});

test('read-along highlights current sentence', async () => {
  openExpanded('psychology');
  render(<FullPlayer />);
  await userEvent.click(screen.getByRole('button', { name: /Текст/ }));
  const r = lib('psychology');
  const sentences = splitSentences(r.text);
  const idx = currentSentenceIndex(r.positionSec, r.durationSec, sentences.length);
  expect(screen.getByText(sentences[idx])).toHaveAttribute('aria-current', 'true');
});

test('night mode button switches to night', async () => {
  openExpanded('metro');
  render(<FullPlayer />);
  await userEvent.click(screen.getByRole('button', { name: /Ночной режим/ }));
  expect(usePlayer.getState().nightMode).toBe(true);
});

test('collapse returns to mini player', async () => {
  openExpanded('metro');
  render(<FullPlayer />);
  await userEvent.click(screen.getByRole('button', { name: 'Свернуть' }));
  expect(usePlayer.getState().expanded).toBe(false);
});
