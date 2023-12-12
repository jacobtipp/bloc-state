import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { AppBlocObserver } from './app-bloc-observer';
import App from '../../app/view/app';
import { Bloc } from '@jacobtipp/bloc';
import { PostRepository } from '../../../packages/post-repository/post-repository';
import { createApiClient } from '../../../packages/api-client/api-client';
import { PostApiClient } from '../../../packages/post-client/post-api-client';

Bloc.observer = new AppBlocObserver();

const apiClient = createApiClient();

const postApiClient = new PostApiClient(apiClient);

const postRepository = new PostRepository(postApiClient);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App postRepository={postRepository} />
  </StrictMode>
);
