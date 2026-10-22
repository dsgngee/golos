import { render, screen } from '@testing-library/react';
import { Styleguide } from './Styleguide';

test('lists every color token for all three themes', () => {
  render(<Styleguide />);
  expect(screen.getAllByTestId('swatch')).toHaveLength(39);
});

test('shows every contrast rule per theme with comma decimals', () => {
  render(<Styleguide />);
  const rows = screen.getAllByTestId('contrast-row');
  expect(rows).toHaveLength(30);
  expect(rows[0].textContent).toMatch(/\d+,\d{2}/);
});

test('documents every reusable component and state', () => {
  render(<Styleguide />);
  for (const label of [
    'Sheet (inline)',
    'ActionSheet (inline)',
    'Banner',
    'Recorder: bereit · Aufnahme · aufgenommen · zu leise',
    'LevelMeter: aus · an',
    'TagEditor',
    'FolderPicker (inline)',
    'CoverPicker',
    'VoiceMissingRow',
    'VoiceCard',
    'Icons',
  ])
    expect(screen.getAllByText(label).length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: 'Mini-Player und Vollbild-Player' })).toBeInTheDocument();
  expect(screen.queryAllByRole('dialog')).toHaveLength(0);
});

test('has a heading and component sections in light and dark', () => {
  render(<Styleguide />);
  expect(screen.getByRole('heading', { level: 1, name: 'Styleguide golos' })).toBeInTheDocument();
  expect(document.querySelectorAll('[data-testid="component-board"][data-theme]')).toHaveLength(2);
});
