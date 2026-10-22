import type { SessionId } from '../store/voice';

export interface VoiceSession {
  id: SessionId;
  title: string;
  subtitle: string;
  mode: 'free' | 'phrases';
  prompt?: string;
  phrases?: string[];
}

export const sessions: VoiceSession[] = [
  {
    id: 'story',
    title: 'Расскажите историю о себе',
    subtitle: 'Около 5 минут · свободная речь',
    mode: 'free',
    prompt: 'Расскажите о дне, который вы запомнили надолго. Где вы были и что почувствовали?',
  },
  {
    id: 'excerpt',
    title: 'Прочитайте отрывок',
    subtitle: 'Около 5 минут · 5 фраз',
    mode: 'phrases',
    phrases: [
      'Город просыпался медленно, будто нехотя.',
      'В окнах первых этажей зажигался свет.',
      'Дворник неторопливо сметал листья с тротуара.',
      'Где-то вдалеке прозвенел первый трамвай.',
      'Начинался обычный осенний понедельник.',
    ],
  },
  {
    id: 'emotion',
    title: 'Прочитайте с эмоцией',
    subtitle: 'Около 5 минут · 5 фраз',
    mode: 'phrases',
    phrases: [
      'Не может быть, мы выиграли!',
      'Тише, ребёнок только что уснул.',
      'Ну сколько можно ждать этот автобус?',
      'Мне так жаль, что всё так вышло.',
      'Смотри, какой огромный радужный мост!',
    ],
  },
];
