import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppBlocObserver } from './app-bloc-observer';
import './App.css';
import App from './pages/App';
import { Bloc } from '@jacobtipp/bloc';

Bloc.observer = new AppBlocObserver();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
