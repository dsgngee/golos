export type RecordingType = 'book' | 'article' | 'language' | 'tale' | 'study';
export type ReadingStyle = 'normal' | 'expressive' | 'calm';
export type LanguageCode = 'ru' | 'en' | 'zh' | 'es' | 'de';

export type Rate = 0.75 | 1 | 1.25 | 1.5 | 2;
export const RATES: readonly Rate[] = [0.75, 1, 1.25, 1.5, 2];

export type SleepOption = 'off' | 15 | 30 | 45 | 60 | 'chapterEnd';

export interface Chapter {
  title: string;
  startSec: number;
}

export type Cover =
  | { kind: 'typo'; tone: 'ink' | 'paper' | 'accent'; glyph?: string }
  | { kind: 'photo'; preset: 1 | 2 | 3 | 4 | 5 | 6 };

export interface Folder {
  id: string;
  name: string;
}

export interface Recording {
  id: string;
  title: string;
  type: RecordingType;
  meta?: string;
  durationSec: number;
  positionSec: number;
  /** 0..1, nur während der (simulierten) Vertonung gesetzt */
  generationProgress?: number;
  folderId: string | null;
  tags: string[];
  cover: Cover;
  language: LanguageCode;
  translatedFrom?: LanguageCode;
  style: ReadingStyle;
  createdAt: string;
  lastPlayedAt?: string;
  chapters?: Chapter[];
  text: string;
}
