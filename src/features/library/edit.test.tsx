import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNav } from '../../app/navigation';
import { useGeneration } from '../../store/generation';
import { useLibrary } from '../../store/library';
import { usePlayer } from '../../store/player';
import { useVoice } from '../../store/voice';
import { lib, top } from '../../test/helpers';
import { EditScreen } from './EditScreen';
import { RecordingList } from './RecordingList';

const renderEdit = (id: string) => {
  useNav.getState().push({ name: 'library.edit', params: { id } });
  return render(<EditScreen params={{ id }} />);
};

beforeEach(() => {
  useLibrary.getState().reset();
  usePlayer.getState().reset();
  useGeneration.getState().reset();
  useNav.getState().reset();
  useVoice.setState({ onboardingDone: true, status: 'ready' });
});

test('revoice is hidden while no voice is set up', async () => {
  useVoice.setState({ status: 'none' });
  renderEdit('kolobok');
  expect(screen.queryByRole('button', { name: 'Озвучить заново' })).toBeNull();
});

test('rename requires non-blank title and applies on Готово', async () => {
  renderEdit('metro');
  const name = screen.getByLabelText('Название');
  await userEvent.clear(name);
  await userEvent.type(name, '   ');
  expect(screen.getByRole('button', { name: 'Готово' })).toBeDisabled();
  await userEvent.clear(name);
  await userEvent.type(name, 'Метро');
  await userEvent.click(screen.getByRole('button', { name: 'Готово' }));
  expect(lib('metro').title).toBe('Метро');
  expect(top('library')).toBe('library.home');
});

test('back discards changes', async () => {
  renderEdit('metro');
  await userEvent.type(screen.getByLabelText('Название'), '!!!');
  await userEvent.click(screen.getByRole('button', { name: 'Назад' }));
  expect(lib('metro').title).toBe('В метро: диалог');
});

test('tags are trimmed and deduped', async () => {
  renderEdit('metro');
  const input = screen.getByRole('textbox', { name: 'Новый тег' });
  await userEvent.type(input, ' Новый {Enter}');
  await userEvent.type(input, 'новый{Enter}');
  await userEvent.click(screen.getByRole('button', { name: 'Готово' }));
  expect(lib('metro').tags.filter((x) => x === 'новый')).toHaveLength(1);
});

test('cover selection', async () => {
  renderEdit('kolobok');
  await userEvent.click(screen.getByRole('button', { name: 'Тёмная обложка' }));
  await userEvent.click(screen.getByRole('button', { name: 'Готово' }));
  expect(lib('kolobok').cover).toMatchObject({ kind: 'typo', tone: 'ink' });
});

test('photo cover via sheet', async () => {
  renderEdit('kolobok');
  await userEvent.click(screen.getByRole('button', { name: 'Фото' }));
  await userEvent.click(screen.getByRole('button', { name: 'Фото 4' }));
  await userEvent.click(screen.getByRole('button', { name: 'Готово' }));
  expect(lib('kolobok').cover).toEqual({ kind: 'photo', preset: 4 });
});

test('deleting the playing recording closes the player', async () => {
  usePlayer.getState().open('metro');
  renderEdit('metro');
  await userEvent.click(screen.getByRole('button', { name: 'Удалить запись' }));
  await userEvent.click(screen.getByRole('button', { name: 'Удалить' }));
  expect(useLibrary.getState().recordings.find((r) => r.id === 'metro')).toBeUndefined();
  expect(usePlayer.getState().currentId).toBeNull();
});

test('row actions: edit pushes the edit screen, revoice starts a job', async () => {
  const rec = useLibrary.getState().recordings.filter((r) => r.id === 'kolobok');
  render(<RecordingList recordings={rec} />);
  await userEvent.click(within(screen.getByTestId('recording-row')).getByRole('button', { name: 'Действия' }));
  await userEvent.click(screen.getByRole('button', { name: 'Озвучить заново' }));
  await userEvent.click(screen.getByRole('button', { name: 'Озвучить' }));
  expect(useGeneration.getState().jobs.map((j) => j.recordingId)).toEqual(['kolobok']);
  await userEvent.click(within(screen.getByTestId('recording-row')).getByRole('button', { name: 'Действия' }));
  await userEvent.click(screen.getByRole('button', { name: 'Изменить' }));
  expect(top('library')).toBe('library.edit');
});
