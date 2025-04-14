import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import App from './App.tsx';
import ContentUploader from './ContentUploader.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentUploader />
  </StrictMode>
);
