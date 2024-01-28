import { QueryClient } from '@jacobtipp/bloc-query';
import {
  RootProvider,
  MultiProvider,
  Provider,
  RepositoryProvider,
  useProvider,
} from '@jacobtipp/react-bloc';
import { PostApiClient } from '../../../packages/post-client/post-api-client';
import { PropsWithChildren } from 'react';
import { PostClient } from '../../../packages/post-client/post-client';
import { PostRepository } from '../../../packages/post-repository/post-repository';
import { AppBlocObserver } from '../../../packages/app-bloc-observer/app-bloc-observer';
import { BlocObserver } from '@jacobtipp/bloc';

export const AppBlocObserverProvider = ({ children }: PropsWithChildren) => (
  <Provider
    classDef={BlocObserver}
    create={() => new AppBlocObserver()}
    onMount={(observer) => (BlocObserver.observer = observer)}
  >
    {children}
  </Provider>
);

const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider
      classDef={QueryClient}
      create={() => new QueryClient()}
      onUnmount={(client) => client.clear()}
    >
      {children}
    </Provider>
  );
};

const PostClientProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useProvider(QueryClient);
  return (
    <Provider
      classDef={PostClient}
      create={() => new PostApiClient(queryClient)}
      dependencies={[queryClient]}
    >
      {children}
    </Provider>
  );
};

const PostRepositoryProvider = ({ children }: PropsWithChildren) => {
  const postClient = useProvider(PostClient);
  return (
    <RepositoryProvider
      repository={PostRepository}
      create={() => new PostRepository(postClient)}
      dependencies={[postClient]}
    >
      {children}
    </RepositoryProvider>
  );
};

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <RootProvider>
      <MultiProvider
        providers={[
          AppBlocObserverProvider,
          QueryClientProvider,
          PostClientProvider,
          PostRepositoryProvider,
        ]}
      >
        {children}
      </MultiProvider>
    </RootProvider>
  );
};
