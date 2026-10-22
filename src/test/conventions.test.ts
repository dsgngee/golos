import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = join(__dirname, '..');

function walk(dir: string): string[] {
  let out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

function existing(dir: string): string[] {
  try {
    return walk(join(root, dir));
  } catch {
    return [];
  }
}

test('no Cyrillic literals outside content and data', () => {
  const files = ['app', 'ui', 'features']
    .flatMap(existing)
    .filter((f) => /\.(ts|tsx)$/.test(f) && !/\.test\.(ts|tsx)$/.test(f));
  const filesWithCyrillic = files
    .filter((f) => /[А-Яа-яЁё]/.test(readFileSync(f, 'utf8')))
    .map((f) => relative(root, f));
  expect(filesWithCyrillic).toEqual([]);
});

test('no hex colors in CSS modules', () => {
  const cssFilesWithHex = walk(root)
    .filter((f) => f.endsWith('.module.css'))
    .filter((f) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(f, 'utf8')))
    .map((f) => relative(root, f));
  expect(cssFilesWithHex).toEqual([]);
});
