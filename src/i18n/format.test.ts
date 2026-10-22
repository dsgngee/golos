import {
  FORMS,
  countLabel,
  formatClock,
  formatDay,
  formatDurationHuman,
  formatEstimate,
  formatRate,
  formatRemaining,
  normalizeSearch,
  plural,
} from './format';

test.each([
  [0, 'записей'],
  [1, 'запись'],
  [2, 'записи'],
  [5, 'записей'],
  [11, 'записей'],
  [12, 'записей'],
  [14, 'записей'],
  [21, 'запись'],
  [22, 'записи'],
  [25, 'записей'],
  [111, 'записей'],
])('plural %i', (n, f) => expect(plural(n, FORMS.recording)).toBe(f));

test('countLabel', () => expect(countLabel(24, FORMS.recording)).toBe('24 записи'));

test('formatClock', () => {
  expect(formatClock(761)).toBe('12:41');
  expect(formatClock(1100)).toBe('18:20');
  expect(formatClock(432)).toBe('07:12');
  expect(formatClock(15125)).toBe('4:12:05');
  expect(formatClock(59.9)).toBe('00:59');
  expect(formatClock(-3)).toBe('00:00');
});

test('formatRemaining', () => expect(formatRemaining(339)).toBe('−05:39'));

test('formatDurationHuman', () => {
  expect(formatDurationHuman(15125)).toBe('4 ч 12 мин');
  expect(formatDurationHuman(1120)).toBe('18 мин');
  expect(formatDurationHuman(30)).toBe('1 мин');
  expect(formatDurationHuman(3600)).toBe('1 ч');
});

test('formatEstimate', () => expect(formatEstimate(1080)).toBe('≈ 18 мин'));

test('formatRate', () => {
  expect([0.75, 1, 1.25, 1.5, 2].map(formatRate)).toEqual(['0,75×', '1×', '1,25×', '1,5×', '2×']);
});

test('formatDay', () => {
  const now = new Date('2026-10-22T12:00:00');
  expect(formatDay(new Date('2026-10-22T08:00:00'), now)).toBe('сегодня');
  expect(formatDay(new Date('2026-10-21T08:00:00'), now)).toBe('вчера');
  expect(formatDay(new Date('2026-10-05T08:00:00'), now)).toBe('5 октября');
});

test('normalizeSearch', () => expect(normalizeSearch('  ЁЖИК   и звёзды ')).toBe('ежик и звезды'));
