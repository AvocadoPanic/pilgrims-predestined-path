import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.css';
import App from './App.jsx';
import { registerSW } from 'virtual:pwa-register';
import { updates } from './pwa/store.js';

updates.start(registerSW);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
