import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { phrases } from '../../data/phrases';
import { Recorder } from './Recorder';

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());

const user = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

// recordOnce(): testlokal – „Записать фразу“ drücken, dann 2 s simulierte Aufnahme
async function recordOnce(u: ReturnType<typeof user>) {
  await u.click(screen.getByRole('button', { name: 'Записать фразу' }));
  act(() => vi.advanceTimersByTime(2000));
}

function Controlled({ start = 0, onDone = () => {} }: { start?: number; onDone?(): void }) {
  const [i, setI] = useState(start);
  return <Recorder mode="phrases" phrases={phrases} index={i} onIndexChange={setI} onDone={onDone} forceTooQuietAt={2} />;
}

test('phrase list has 30 phrases', () => expect(phrases).toHaveLength(30));

test('recorder shows counter and forced warning on phrase 3', async () => {
  const u = user();
  render(<Controlled start={2} />);
  expect(screen.getByText('Фраза 3 из 30')).toBeInTheDocument();
  await recordOnce(u);
  expect(screen.getByText('Слишком тихо — попробуйте ещё раз')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Дальше' })).toBeDisabled();
  await recordOnce(u);
  expect(screen.queryByText('Слишком тихо — попробуйте ещё раз')).toBeNull();
  expect(screen.getByRole('button', { name: 'Дальше' })).toBeEnabled();
});

test('next advances to the following phrase', async () => {
  const u = user();
  render(<Controlled />);
  await recordOnce(u);
  await u.click(screen.getByRole('button', { name: 'Дальше' }));
  expect(screen.getByText('Фраза 2 из 30')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Дальше' })).toBeDisabled();
});

test('prototype hint finishes recording', async () => {
  const u = user();
  const onDone = vi.fn();
  render(<Controlled onDone={onDone} />);
  await u.click(screen.getByRole('button', { name: 'Записать все фразы (прототип)' }));
  expect(onDone).toHaveBeenCalled();
});

test('free mode records with a timer and finishes after 5 s', async () => {
  const u = user();
  const onDone = vi.fn();
  render(<Recorder mode="free" prompt="Расскажите историю о себе" onDone={onDone} />);
  await u.click(screen.getByRole('button', { name: 'Начать' }));
  expect(screen.getByRole('button', { name: 'Закончить' })).toBeDisabled();
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByText('00:05')).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: 'Закончить' }));
  expect(onDone).toHaveBeenCalled();
});
