import { RepositoryProvider } from '@jacobtipp/react-bloc';
import { PostRepository } from '../../../packages/post-repository/post-repository';
import { HomePage } from '../../home/view/home';
import './app.css';
import { useState } from 'react';
import { QueryClient } from '@jacobtipp/bloc-query';
import { PostApiClient } from '../../../packages/post-client/post-api-client';

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [postApiClient] = useState(() => new PostApiClient(queryClient));

  return (
    <RepositoryProvider
      repository={PostRepository}
      create={() => new PostRepository(postApiClient)}
    >
      <HomePage />
    </RepositoryProvider>
  );
}
