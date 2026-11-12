import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {Router} from '@/router';

import '@/styles/main.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Unable to find the root container.');
}

createRoot(container).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
