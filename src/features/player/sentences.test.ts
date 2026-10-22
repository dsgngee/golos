import { currentSentenceIndex, splitSentences } from './sentences';

test('splitSentences', () =>
  expect(splitSentences('Привет. Как дела? Отлично… Да!')).toEqual(['Привет.', 'Как дела?', 'Отлично…', 'Да!']));

test('currentSentenceIndex', () => {
  expect(currentSentenceIndex(0, 100, 4)).toBe(0);
  expect(currentSentenceIndex(60, 100, 4)).toBe(2);
  expect(currentSentenceIndex(100, 100, 4)).toBe(3);
});
