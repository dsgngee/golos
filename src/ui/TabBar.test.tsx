import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNav } from '../app/navigation';
import { TabBar } from './TabBar';

beforeEach(() => useNav.getState().reset());

test('TabBar renders four Russian tabs and switches', async () => {
  render(<TabBar />);
  expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['Библиотека', 'Озвучить', 'Голос', 'Профиль']);
  await userEvent.click(screen.getByRole('tab', { name: 'Голос' }));
  expect(screen.getByRole('tab', { name: 'Голос' })).toHaveAttribute('aria-selected', 'true');
  expect(useNav.getState().tab).toBe('voice');
});
