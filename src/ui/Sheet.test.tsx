import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionSheet } from './ActionSheet';
import { Sheet } from './Sheet';

test('Sheet closes on Escape and is modal', async () => {
  const onClose = vi.fn();
  render(
    <Sheet open onClose={onClose} title="Скорость">
      x
    </Sheet>,
  );
  expect(screen.getByRole('dialog', { name: 'Скорость' })).toHaveAttribute('aria-modal', 'true');
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
});

test('Sheet renders nothing when closed', () => {
  render(
    <Sheet open={false} onClose={() => {}}>
      x
    </Sheet>,
  );
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('ActionSheet runs action, closes, and offers cancel', async () => {
  const onClose = vi.fn();
  const onSelect = vi.fn();
  render(<ActionSheet open onClose={onClose} actions={[{ label: 'Удалить', onSelect, destructive: true }]} />);
  await userEvent.click(screen.getByRole('button', { name: 'Удалить' }));
  expect(onSelect).toHaveBeenCalled();
  expect(onClose).toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
});
