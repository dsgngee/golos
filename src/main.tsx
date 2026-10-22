import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { installDevHooks } from './app/devHooks';
import { injectTokens } from './design/injectTokens';
import './design/global.css';

// Auch dann gesetzt, wenn ein Host (z. B. der Artifact-Rahmen) das eigene <html>-Element liefert.
document.documentElement.lang = 'ru';
injectTokens();
installDevHooks();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
