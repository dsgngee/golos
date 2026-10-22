import { fireEvent, render, screen } from '@testing-library/react';
import { useLongPress } from './useLongPress';

function Probe({ onLong, onClick }: { onLong(): void; onClick(): void }) {
  const handlers = useLongPress(onLong);
  return (
    <button {...handlers} onClick={onClick}>
      x
    </button>
  );
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('long press fires after 500 ms and suppresses the click', () => {
  const onLong = vi.fn();
  const onClick = vi.fn();
  render(<Probe onLong={onLong} onClick={onClick} />);
  const b = screen.getByRole('button');
  fireEvent.pointerDown(b, { clientX: 0, clientY: 0 });
  vi.advanceTimersByTime(499);
  expect(onLong).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(onLong).toHaveBeenCalledTimes(1);
  fireEvent.pointerUp(b);
  fireEvent.click(b);
  expect(onClick).not.toHaveBeenCalled();
});

test('movement cancels the long press', () => {
  const onLong = vi.fn();
  render(<Probe onLong={onLong} onClick={() => {}} />);
  const b = screen.getByRole('button');
  fireEvent.pointerDown(b, { clientX: 0, clientY: 0 });
  fireEvent.pointerMove(b, { clientX: 20, clientY: 0 });
  vi.advanceTimersByTime(600);
  expect(onLong).not.toHaveBeenCalled();
});

test('short tap still clicks', () => {
  const onClick = vi.fn();
  render(<Probe onLong={() => {}} onClick={onClick} />);
  const b = screen.getByRole('button');
  fireEvent.pointerDown(b, { clientX: 0, clientY: 0 });
  vi.advanceTimersByTime(100);
  fireEvent.pointerUp(b);
  fireEvent.click(b);
  expect(onClick).toHaveBeenCalled();
});
