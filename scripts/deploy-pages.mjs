// Baut den Prototyp und veröffentlicht dist/ im Branch gh-pages (GitHub Pages).
// Aufruf: npm run deploy
import { execSync } from 'node:child_process';
import ghpages from 'gh-pages';

execSync('npm run build', { stdio: 'inherit' });

await ghpages.publish('dist', {
  dotfiles: true,
  message: 'deploy: Prototyp auf GitHub Pages\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>',
});

console.log('Veröffentlicht: https://dsgngee.github.io/golos/');
