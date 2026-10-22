import { top } from '../test/helpers';
import { useNav } from './navigation';

beforeEach(() => useNav.getState().reset());

test('push/pop and pop at root is no-op', () => {
  const n = useNav.getState();
  n.push({ name: 'library.search' });
  expect(top('library')).toBe('library.search');
  n.pop();
  n.pop();
  expect(top('library')).toBe('library.home');
});

test('switching to the active tab pops to root', () => {
  const n = useNav.getState();
  n.push({ name: 'library.search' });
  n.switchTab('library');
  expect(top('library')).toBe('library.home');
});

test('stacks are kept per tab', () => {
  const n = useNav.getState();
  n.push({ name: 'library.search' });
  n.switchTab('voice');
  expect(useNav.getState().tab).toBe('voice');
  n.switchTab('library');
  expect(top('library')).toBe('library.search');
});

test('push goes to the active tab and popToRoot targets a given tab', () => {
  const n = useNav.getState();
  n.switchTab('create');
  n.push({ name: 'create.review' });
  n.push({ name: 'create.options' });
  n.switchTab('library');
  n.popToRoot('create');
  expect(top('create')).toBe('create.source');
});

test('reset restores all roots', () => {
  const n = useNav.getState();
  n.push({ name: 'library.search' });
  n.switchTab('profile');
  n.reset();
  expect(useNav.getState().tab).toBe('library');
  expect(top('library')).toBe('library.home');
});
