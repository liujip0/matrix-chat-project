import { Configuration } from '@react-md/layout';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Configuration>
      <App />
    </Configuration>
  </StrictMode>
);
