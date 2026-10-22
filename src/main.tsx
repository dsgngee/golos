import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { installDevHooks } from './app/devHooks';
import { injectTokens } from './design/injectTokens';
import './design/global.css';

injectTokens();
installDevHooks();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
