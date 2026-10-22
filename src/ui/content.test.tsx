import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { seedRecordings } from '../data/seed';
import { Cover } from './Cover';
import { EmptyState } from './EmptyState';
import { RecordingRow } from './RecordingRow';

const kolobok = seedRecordings.find((r) => r.id === 'kolobok')!;

test('RecordingRow shows number, title, type and duration', async () => {
  const onPress = vi.fn();
  const onMore = vi.fn();
  render(<RecordingRow recording={kolobok} index={1} onPress={onPress} onMore={onMore} />);
  expect(screen.getByText('01')).toBeInTheDocument();
  expect(screen.getByText('Колобок')).toBeInTheDocument();
  expect(screen.getByText('Сказка')).toBeInTheDocument();
  expect(screen.getByText('07:12')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Действия' }));
  expect(onMore).toHaveBeenCalled();
  await userEvent.click(screen.getByText('Колобок'));
  expect(onPress).toHaveBeenCalled();
});

test('RecordingRow states: generating and finished', () => {
  const { rerender } = render(
    <RecordingRow recording={{ ...kolobok, generationProgress: 0.42 }} onPress={() => {}} />,
  );
  expect(screen.getByText('Озвучивается… 42 %')).toBeInTheDocument();
  rerender(<RecordingRow recording={{ ...kolobok, positionSec: kolobok.durationSec }} onPress={() => {}} />);
  expect(screen.getByText('Прослушано')).toBeInTheDocument();
  expect(screen.getByTestId('recording-row')).toBeInTheDocument();
});

test('Cover uses glyph or first letter', () => {
  const { rerender } = render(<Cover cover={{ kind: 'typo', tone: 'ink', glyph: '中' }} title="В метро" size="m" />);
  expect(screen.getByText('中')).toBeInTheDocument();
  rerender(<Cover cover={{ kind: 'typo', tone: 'paper' }} title="колобок" size="m" />);
  expect(screen.getByText('К')).toBeInTheDocument();
});

test('EmptyState renders title, body and action', async () => {
  const onClick = vi.fn();
  render(<EmptyState title="Ничего не найдено" body="Попробуйте другой запрос." action={{ label: 'Сбросить фильтры', onClick }} />);
  expect(screen.getByRole('heading', { name: 'Ничего не найдено' })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));
  expect(onClick).toHaveBeenCalled();
});
