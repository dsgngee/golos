import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNav } from '../../app/navigation';
import { useVoice } from '../../store/voice';
import { OnboardingFlow } from './OnboardingFlow';

beforeEach(() => {
  useVoice.getState().reset();
  useNav.getState().reset();
});

afterEach(() => vi.useRealTimers());

test('Позже completes onboarding without voice', async () => {
  render(<OnboardingFlow />);
  expect(screen.getByText('Слушайте любой текст своим голосом')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Позже' }));
  expect(useVoice.getState()).toMatchObject({ onboardingDone: true, status: 'none' });
});

test('expectation step explains the unfamiliar voice', async () => {
  render(<OnboardingFlow />);
  await userEvent.click(screen.getByRole('button', { name: 'Настроить голос' }));
  expect(screen.getByText('Сначала голос покажется непривычным')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Назад' }));
  expect(useVoice.getState().setupStep).toBe('welcome');
});

test('full happy path ends ready', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const u = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(<OnboardingFlow />);
  await u.click(screen.getByRole('button', { name: 'Настроить голос' }));
  await u.click(screen.getByRole('button', { name: 'Понятно' }));
  await u.click(screen.getByRole('button', { name: 'Начать запись' }));
  expect(screen.getByText('Фраза 1 из 30')).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: 'Записать все фразы (прототип)' }));
  await u.click(screen.getByRole('button', { name: 'Создать голос' }));
  expect(screen.getByText('Создаём ваш голос…')).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(4000));
  expect(screen.getByText('Послушайте себя')).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: 'В библиотеку' }));
  expect(useVoice.getState()).toMatchObject({ onboardingDone: true, status: 'ready', quality: 86 });
  expect(useNav.getState().tab).toBe('library');
});

test('setup started from the app begins at prepare and can be cancelled', async () => {
  useVoice.getState().completeOnboarding();
  useVoice.getState().startSetup();
  render(<OnboardingFlow />);
  expect(screen.getByText('Подготовьтесь')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Назад' }));
  expect(useVoice.getState().setupActive).toBe(false);
});

test('pause keeps the phrase index', async () => {
  useVoice.setState({ setupStep: 'record', phraseIndex: 4 });
  render(<OnboardingFlow />);
  expect(screen.getByText('Фраза 5 из 30')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Пауза' }));
  expect(useVoice.getState()).toMatchObject({ setupStep: 'prepare', phraseIndex: 4 });
});
