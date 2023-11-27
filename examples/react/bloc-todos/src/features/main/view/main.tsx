import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppBlocObserver } from './app-bloc-observer';
import App from '../../app/view/app';
import { Bloc } from '@jacobtipp/bloc';

Bloc.observer = new AppBlocObserver();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
