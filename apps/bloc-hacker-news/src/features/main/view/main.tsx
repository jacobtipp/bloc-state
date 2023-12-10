import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { AppBlocObserver } from './app-bloc-observer';
import App from '../../app/view/app';
import { Bloc } from '@jacobtipp/bloc';
import { PostRepository } from '../../../packages/post-repository/post-repository';
import { createApiClient } from '../../../packages/api-client/api-client';
import { PostApiClient } from '../../../packages/post-client/post-api-client';
import { QueryClient } from '@jacobtipp/bloc-query';

Bloc.observer = new AppBlocObserver();

const apiClient = createApiClient()

const queryClient = new QueryClient()

const postApiClient = new PostApiClient(apiClient);

const postRepository = new PostRepository(postApiClient, queryClient);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App postRepository={postRepository} />
  </StrictMode>
);
