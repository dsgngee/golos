import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNav } from '../../app/navigation';
import { useGeneration } from '../../store/generation';
import { useLibrary } from '../../store/library';
import { useVoice } from '../../store/voice';
import { draftFromLink, top } from '../../test/helpers';
import { useDraft } from './draft';
import { OptionsScreen } from './OptionsScreen';
import { ReviewScreen } from './ReviewScreen';
import { SourceScreen } from './SourceScreen';

beforeEach(() => {
  useLibrary.getState().reset();
  useGeneration.getState().reset();
  useDraft.getState().resetDraft();
  useNav.getState().reset();
  useNav.getState().switchTab('create');
  useVoice.setState({ onboardingDone: true, status: 'ready' });
});

test('paste option opens review with an empty draft', async () => {
  render(<SourceScreen />);
  await userEvent.click(screen.getByRole('button', { name: /Вставить текст/ }));
  expect(top('create')).toBe('create.review');
  expect(useDraft.getState().draft.source).toBe('text');
});

test('link option extracts sample text', async () => {
  render(<SourceScreen />);
  await userEvent.click(screen.getByRole('button', { name: /Ссылка на статью/ }));
  await userEvent.click(screen.getByRole('button', { name: 'Извлечь текст' }));
  expect(useDraft.getState().draft).toMatchObject({ source: 'link', simulatedWords: 2700 });
  expect(top('create')).toBe('create.review');
});

test('next is disabled for blank text', async () => {
  useDraft.getState().setDraft({ text: '   ' });
  render(<ReviewScreen />);
  expect(screen.getByRole('button', { name: 'Далее' })).toBeDisabled();
  expect(screen.getByText('Добавьте текст, чтобы продолжить')).toBeInTheDocument();
});

test('review shows stats and suggests a title', async () => {
  useDraft.getState().setDraft(draftFromLink());
  useDraft.getState().setDraft({ title: '' });
  render(<ReviewScreen />);
  expect(screen.getByText(/2700 слов · ≈ 18 мин/)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Далее' }));
  expect(useDraft.getState().draft.title).not.toBe('');
  expect(top('create')).toBe('create.options');
});

test('voice missing replaces CTA', () => {
  useVoice.setState({ status: 'none' });
  useDraft.getState().setDraft(draftFromLink());
  render(<OptionsScreen />);
  expect(screen.getByRole('button', { name: 'Сначала настройте голос' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Озвучить' })).toBeNull();
});

test('Озвучить disables after first tap and starts one job', async () => {
  useDraft.getState().setDraft(draftFromLink());
  render(<OptionsScreen />);
  const cta = screen.getByRole('button', { name: 'Озвучить' });
  await userEvent.click(cta);
  await userEvent.click(cta);
  expect(useGeneration.getState().jobs).toHaveLength(1);
  expect(top('create')).toBe('create.generating');
});

test('blank title disables Озвучить', async () => {
  useDraft.getState().setDraft({ ...draftFromLink(), title: '  ' });
  render(<OptionsScreen />);
  expect(screen.getByRole('button', { name: 'Озвучить' })).toBeDisabled();
});
