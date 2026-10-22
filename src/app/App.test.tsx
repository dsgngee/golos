import { render, screen } from '@testing-library/react';
import { useSettings } from '../store/settings';
import App from './App';

test('styleguide keeps the document light even when the app theme is dark', () => {
  useSettings.getState().set('theme', 'dark');
  window.location.hash = '#styleguide';
  render(<App />);
  expect(document.documentElement.dataset.theme).toBe('light');
  window.location.hash = '';
  useSettings.getState().reset();
});

test('renders app root', () => {
  render(<App />);
  expect(screen.getByTestId('app-root')).toBeInTheDocument();
});
