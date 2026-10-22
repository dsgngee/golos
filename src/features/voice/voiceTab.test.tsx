import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNav } from '../../app/navigation';
import { useGeneration } from '../../store/generation';
import { useLibrary } from '../../store/library';
import { useVoice } from '../../store/voice';
import { top } from '../../test/helpers';
import { RevoiceScreen } from './RevoiceScreen';
import { VoiceHome } from './VoiceHome';
import { VoiceSessionScreen } from './VoiceSessionScreen';

beforeEach(() => {
  useLibrary.getState().reset();
  useGeneration.getState().reset();
  useNav.getState().reset();
  useNav.getState().switchTab('voice');
  useVoice.getState().reset();
  useVoice.setState({ onboardingDone: true, status: 'ready', quality: 86, minutes: 10, updatedAt: new Date().toISOString() });
});

test('voice card shows quality, minutes with plural, updated day', () => {
  render(<VoiceHome />);
  expect(screen.getByText('Ваш голос · 86 %')).toBeInTheDocument();
  expect(screen.getByText('Записано 10 минут')).toBeInTheDocument();
  expect(screen.getByText('Обновлён сегодня')).toBeInTheDocument();
  expect(screen.getByRole('progressbar', { name: 'Качество голоса' })).toHaveAttribute('aria-valuenow', '86');
});

test('session row opens the session screen', async () => {
  render(<VoiceHome />);
  await userEvent.click(screen.getByRole('button', { name: /Расскажите историю о себе/ }));
  expect(top('voice')).toBe('voice.session');
});

test('session completion raises quality and offers revoice', async () => {
  render(<VoiceSessionScreen params={{ id: 'story' }} />);
  await userEvent.click(screen.getByRole('button', { name: 'Завершить (прототип)' }));
  expect(screen.getByText('Голос обновлён: 89 %')).toBeInTheDocument();
  expect(useVoice.getState().sessionsDone).toEqual(['story']);
  await userEvent.click(screen.getByRole('button', { name: 'Выбрать записи' }));
  expect(top('voice')).toBe('voice.revoice');
});

test('revoice selected starts jobs and disables when none selected', async () => {
  render(<RevoiceScreen />);
  expect(screen.getByRole('button', { name: 'Озвучить заново (0)' })).toBeDisabled();
  await userEvent.click(screen.getByRole('checkbox', { name: /Колобок/ }));
  await userEvent.click(screen.getByRole('checkbox', { name: /Теремок/ }));
  await userEvent.click(screen.getByRole('button', { name: 'Озвучить заново (2)' }));
  expect(useGeneration.getState().jobs.map((j) => j.recordingId).sort()).toEqual(['kolobok', 'teremok']);
});

test('select all selects every recording', async () => {
  render(<RevoiceScreen />);
  await userEvent.click(screen.getByRole('button', { name: 'Выбрать все' }));
  expect(screen.getByRole('button', { name: 'Озвучить заново (24)' })).toBeEnabled();
});

test('missing voice shows setup card', async () => {
  useVoice.getState().deleteVoice();
  render(<VoiceHome />);
  await userEvent.click(screen.getByRole('button', { name: 'Настроить голос' }));
  expect(useVoice.getState().setupActive).toBe(true);
});
