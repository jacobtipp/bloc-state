import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app';
import './styles.css';
import {
  HydratedLocalStorage,
  HydratedStorage,
} from '@jacobtipp/hydrated-bloc';

HydratedStorage.storage = new HydratedLocalStorage();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
