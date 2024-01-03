import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppBlocObserver } from './app-bloc-observer';
import App from '../../app/view/app';
import { Bloc } from '@jacobtipp/bloc';
import {
  HydratedStorage,
  HydratedLocalStorage,
} from '@jacobtipp/hydrated-bloc';
import { StrictMode } from 'react';

Bloc.observer = new AppBlocObserver();

HydratedStorage.storage = new HydratedLocalStorage();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
