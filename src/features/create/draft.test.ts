import { estimateSec, suggestTitle, wordCount } from './draft';

test('estimate and title', () => {
  expect(estimateSec(2700)).toBe(1080);
  expect(suggestTitle('Сенсорная интеграция. Второе.')).toBe('Сенсорная интеграция');
  expect(wordCount('  раз  два ')).toBe(2);
  expect(wordCount('   ')).toBe(0);
});

test('long first sentence is shortened with ellipsis', () => {
  const long = 'Очень длинное первое предложение, которое никак не помещается в название записи и продолжается дальше. Второе.';
  const title = suggestTitle(long);
  expect(title.length).toBeLessThanOrEqual(60);
  expect(title.endsWith('…')).toBe(true);
});
