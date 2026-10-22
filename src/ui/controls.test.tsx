import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { PlayButton } from './PlayButton';
import { ProgressLine } from './ProgressLine';
import { SegmentedControl } from './SegmentedControl';
import { SkipButton } from './SkipButton';
import { Toggle } from './Toggle';

test('ProgressLine exposes slider semantics and keyboard seek', async () => {
  const onSeek = vi.fn();
  render(<ProgressLine valueSec={761} max={1100} onSeek={onSeek} />);
  const s = screen.getByRole('slider');
  expect(s).toHaveAttribute('aria-valuetext', '12:41 из 18:20');
  expect(s).toHaveAttribute('aria-valuenow', '761');
  s.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(onSeek).toHaveBeenCalledWith(766);
  await userEvent.keyboard('{ArrowLeft}');
  expect(onSeek).toHaveBeenLastCalledWith(756);
});

test('ProgressLine pointer maps x to seconds', () => {
  const onSeek = vi.fn();
  render(<ProgressLine valueSec={0} max={1100} onSeek={onSeek} />);
  const s = screen.getByRole('slider');
  s.getBoundingClientRect = () => ({ left: 0, width: 200, top: 0, height: 44, right: 200, bottom: 44, x: 0, y: 0, toJSON: () => ({}) });
  fireEvent.pointerDown(s, { clientX: 100, pointerId: 1 });
  expect(onSeek).toHaveBeenCalledWith(550);
});

test('SkipButton labels', () => {
  render(
    <>
      <SkipButton direction="back" step={15} onClick={() => {}} />
      <SkipButton direction="forward" step={30} onClick={() => {}} />
    </>,
  );
  expect(screen.getByRole('button', { name: 'Назад на 15 секунд' })).toHaveTextContent('15');
  expect(screen.getByRole('button', { name: 'Вперёд на 30 секунд' })).toBeInTheDocument();
});

test('PlayButton toggles label', async () => {
  const onToggle = vi.fn();
  const { rerender } = render(<PlayButton playing={false} onToggle={onToggle} />);
  await userEvent.click(screen.getByRole('button', { name: 'Воспроизвести' }));
  expect(onToggle).toHaveBeenCalled();
  rerender(<PlayButton playing onToggle={onToggle} />);
  expect(screen.getByRole('button', { name: 'Пауза' })).toBeInTheDocument();
});

function Segmented() {
  const [v, setV] = useState('a');
  return (
    <SegmentedControl<string>
      ariaLabel="Тема"
      value={v}
      onChange={setV}
      options={[
        { value: 'a', label: 'Светлая' },
        { value: 'b', label: 'Тёмная' },
      ]}
    />
  );
}

test('SegmentedControl is a radiogroup with arrow keys', async () => {
  render(<Segmented />);
  expect(screen.getByRole('radiogroup', { name: 'Тема' })).toBeInTheDocument();
  screen.getByRole('radio', { name: 'Светлая' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(screen.getByRole('radio', { name: 'Тёмная' })).toHaveAttribute('aria-checked', 'true');
  await userEvent.click(screen.getByRole('radio', { name: 'Светлая' }));
  expect(screen.getByRole('radio', { name: 'Светлая' })).toHaveAttribute('aria-checked', 'true');
});

test('Toggle is a switch', async () => {
  const onChange = vi.fn();
  render(<Toggle checked={false} onChange={onChange} label="Когда озвучка готова" />);
  const sw = screen.getByRole('switch', { name: 'Когда озвучка готова' });
  expect(sw).toHaveAttribute('aria-checked', 'false');
  await userEvent.click(sw);
  expect(onChange).toHaveBeenCalledWith(true);
});
