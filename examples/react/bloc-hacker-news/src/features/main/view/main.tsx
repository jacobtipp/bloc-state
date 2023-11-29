import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { AppBlocObserver } from './app-bloc-observer';
import App from '../../app/view/app';
import { Bloc } from '@jacobtipp/bloc';
import { RestPostClient } from '../../../packages/post-client/rest-post-client';
import { PostRepository } from '../../../packages/post-repository/post-repository';

Bloc.observer = new AppBlocObserver();

const restPostClient = new RestPostClient();

const postRepository = new PostRepository(restPostClient);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App postRepository={postRepository} />
  </StrictMode>
);
