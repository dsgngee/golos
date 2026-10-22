import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../app/App';
import { useNav } from '../../app/navigation';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { useSettings } from '../../store/settings';
import { useVoice } from '../../store/voice';
import { ProfileScreen } from './ProfileScreen';

beforeEach(() => {
  useLibrary.getState().reset();
  useSettings.getState().reset();
  usePlayer.getState().reset();
  useNav.getState().reset();
  useVoice.getState().reset();
  useVoice.setState({ onboardingDone: true, status: 'ready', quality: 86, minutes: 10 });
});

test('theme switch sets data-theme on app root', async () => {
  useNav.getState().switchTab('profile');
  render(<App />);
  await userEvent.click(screen.getByRole('radio', { name: 'Тёмная' }));
  expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark');
});

test('skip step changes the setting', async () => {
  render(<ProfileScreen />);
  await userEvent.click(screen.getByRole('radio', { name: '30 сек' }));
  expect(useSettings.getState().skipStep).toBe(30);
});

test('default speed sheet sets default and current rate', async () => {
  render(<ProfileScreen />);
  await userEvent.click(screen.getByRole('button', { name: /Скорость по умолчанию/ }));
  await userEvent.click(screen.getByRole('radio', { name: '1,25×' }));
  expect(useSettings.getState().defaultRate).toBe(1.25);
  expect(usePlayer.getState().rate).toBe(1.25);
});

test('notifications toggle', async () => {
  render(<ProfileScreen />);
  await userEvent.click(screen.getByRole('switch', { name: 'Когда озвучка готова' }));
  expect(useSettings.getState().notifyReady).toBe(false);
});

test('delete voice keeps recordings', async () => {
  render(<ProfileScreen />);
  await userEvent.click(screen.getByRole('button', { name: 'Удалить данные голоса' }));
  await userEvent.click(screen.getByRole('button', { name: 'Удалить' }));
  expect(useVoice.getState().status).toBe('none');
  expect(useLibrary.getState().recordings).toHaveLength(24);
});

test('blank name is ignored, valid name is saved', async () => {
  render(<ProfileScreen />);
  await userEvent.click(screen.getByRole('button', { name: 'Изменить имя' }));
  const field = screen.getByRole('textbox', { name: 'Имя' });
  await userEvent.clear(field);
  await userEvent.type(field, '   ');
  expect(screen.getByRole('button', { name: 'Сохранить' })).toBeDisabled();
  await userEvent.clear(field);
  await userEvent.type(field, 'Мария');
  await userEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(useSettings.getState().name).toBe('Мария');
});

test('manage voice switches to the voice tab', async () => {
  render(<ProfileScreen />);
  await userEvent.click(screen.getByRole('button', { name: /Управление голосом/ }));
  expect(useNav.getState().tab).toBe('voice');
});
