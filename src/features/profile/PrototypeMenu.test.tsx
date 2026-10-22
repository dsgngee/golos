import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useVoice } from '../../store/voice';
import { PrototypeMenu } from './PrototypeMenu';

test('menu lists all scenarios', () => {
  render(<PrototypeMenu />);
  expect(screen.getByText('Этого раздела не будет в приложении')).toBeInTheDocument();
  expect(screen.getAllByRole('button')).toHaveLength(8);
});

test('menu button runs its scenario', async () => {
  render(<PrototypeMenu />);
  await userEvent.click(screen.getByRole('button', { name: 'Голос не настроен' }));
  expect(useVoice.getState()).toMatchObject({ onboardingDone: true, status: 'none' });
});
