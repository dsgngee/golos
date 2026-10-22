// Alle UI-Texte des Prototyps. Komponenten enthalten keine russischen Literale.
import type { RecordingType } from '../data/types';
import { FORMS, plural } from '../i18n/format';

const seconds = (n: number) => `${n} ${plural(n, FORMS.second)}`;

export const typeLabel: Record<RecordingType, string> = {
  book: 'Книга',
  article: 'Статья',
  language: 'Язык',
  tale: 'Сказка',
  study: 'Учёба',
};

export const typeFilterLabel: Record<RecordingType | 'all', string> = {
  all: 'Все',
  book: 'Книги',
  article: 'Статьи',
  language: 'Языки',
  tale: 'Сказки',
  study: 'Учёба',
};

export const t = {
  appTitle: 'golos — прототип',
  tabs: {
    label: 'Разделы',
    library: 'Библиотека',
    create: 'Озвучить',
    voice: 'Голос',
    profile: 'Профиль',
  },
  common: {
    back: 'Назад',
    cancel: 'Отмена',
    done: 'Готово',
    close: 'Закрыть',
  },
  banner: {
    app: 'golos',
  },
  player: {
    play: 'Воспроизвести',
    pause: 'Пауза',
    position: 'Позиция',
    skipBack: (n: number) => `Назад на ${seconds(n)}`,
    skipForward: (n: number) => `Вперёд на ${seconds(n)}`,
    progressOf: (a: string, b: string) => `${a} из ${b}`,
  },
  row: {
    more: 'Действия',
    finished: 'Прослушано',
    generating: (percent: number) => `Озвучивается… ${percent} %`,
  },
  library: {
    title: 'Библиотека',
    search: 'Поиск',
    continue: 'Продолжить',
    create: 'Озвучить текст',
    recent: 'Недавние',
    all: 'Все записи',
    voiceMissing: 'Голос ещё не настроен',
    setup: 'Настроить',
    emptyTitle: 'Здесь появятся ваши записи',
    emptyBody: 'Вставьте текст, загрузите PDF или ссылку — и слушайте своим голосом.',
  },
  mini: {
    open: 'Открыть плеер',
  },
} as const;
