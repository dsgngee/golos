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
    collapse: 'Свернуть',
    speed: 'Скорость',
    timer: 'Таймер',
    sleepTitle: 'Таймер сна',
    sleepOff: 'Выкл',
    minutes: (n: number) => `${n} мин`,
    chapterEnd: 'До конца главы',
    chapters: 'Главы',
    text: 'Текст',
    night: 'Ночной режим',
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
  styleguide: {
    titleXL: 'Библиотека',
    title: 'В метро: диалог',
    body: 'Слушайте любой текст своим голосом — статьи, книги, уроки и сказки.',
    meta: 'Китайский язык · урок 4',
    mono: '12:41 / 18:20',
    label: 'Продолжить',
    filled: 'Слушать',
    plain: 'Не сейчас',
    destructive: 'Удалить запись',
    disabled: 'Далее',
    chipA: 'Сказки',
    chipB: 'Книги',
    segA: 'Светлая',
    segB: 'Тёмная',
    toggle: 'Когда озвучка готова',
    field: 'Название',
    fieldValue: 'Колобок',
    hint: 'Записать все фразы (прототип)',
    emptyTitle: 'Ничего не найдено',
    emptyBody: 'Попробуйте другой запрос или сбросьте фильтры.',
    emptyAction: 'Сбросить фильтры',
    nav: 'Изменить',
  },
} as const;
