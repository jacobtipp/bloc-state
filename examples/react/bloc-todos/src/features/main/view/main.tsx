import ReactDOM from 'react-dom/client';
import App from '../../app/view/app';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
