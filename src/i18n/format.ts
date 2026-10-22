export type PluralForms = readonly [one: string, few: string, many: string];

export const FORMS: Record<'recording' | 'minute' | 'second' | 'word' | 'chapter', PluralForms> = {
  recording: ['запись', 'записи', 'записей'],
  minute: ['минута', 'минуты', 'минут'],
  second: ['секунда', 'секунды', 'секунд'],
  word: ['слово', 'слова', 'слов'],
  chapter: ['глава', 'главы', 'глав'],
};

export function plural(n: number, forms: PluralForms): string {
  const abs = Math.abs(Math.trunc(n));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

export function countLabel(n: number, forms: PluralForms): string {
  return `${n} ${plural(n, forms)}`;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function formatClock(sec: number): string {
  const total = Math.max(0, Math.floor(sec));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function formatRemaining(sec: number): string {
  return `−${formatClock(sec)}`;
}

export function formatDurationHuman(sec: number): string {
  const minutes = Math.max(1, Math.floor(sec / 60));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} мин`;
  return m === 0 ? `${h} ч` : `${h} ч ${m} мин`;
}

export function formatEstimate(sec: number): string {
  return `≈ ${formatDurationHuman(sec)}`;
}

export function formatRate(rate: number): string {
  return `${String(rate).replace('.', ',')}×`;
}

const dayFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export function formatDay(date: Date, now: Date): string {
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (diffDays === 0) return 'сегодня';
  if (diffDays === 1) return 'вчера';
  return dayFormat.format(date);
}

export function normalizeSearch(s: string): string {
  return s.toLowerCase().replace(/ё/g, 'е').trim().replace(/\s+/g, ' ');
}
