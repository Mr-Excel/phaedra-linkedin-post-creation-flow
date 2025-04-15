import { createRoot } from 'react-dom/client';
import './index.css';
// import App from './App.tsx';
import ContentUploader from './components/ContentUploader';
import LoginForm from './Login.tsx';

createRoot(document.getElementById('root')!).render(
  <LoginForm>
    <ContentUploader />
  </LoginForm>
);
