'use client';
import { QueryClient } from '@jacobtipp/bloc-query';
import {
  MultiProvider,
  Provider,
  RepositoryProvider,
  useProvider,
  ContextMapProvider,
} from '@jacobtipp/react-bloc';
import { PostApiClient } from '../../../packages/post-client/post-api-client';
import { PropsWithChildren } from 'react';
import { PostClient } from '../../../packages/post-client/post-client';
import { PostRepository } from '../../../packages/post-repository/post-repository';
import { BlocObserver } from '@jacobtipp/bloc';
import { AppBlocObserver } from '../../../packages/app-bloc-observer/app-bloc-observer';

export const AppBlocObserverProvider = ({ children }: PropsWithChildren) => (
  <Provider
    classDef={BlocObserver}
    create={() => {
      const observer = new AppBlocObserver();
      BlocObserver.observer = observer;
      return observer;
    }}
  >
    {children}
  </Provider>
);

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider
      classDef={QueryClient}
      create={() => new QueryClient()}
      onUnmount={(client) => client.close()}
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
    <ContextMapProvider>
      <MultiProvider
        providers={[
          //AppBlocObserverProvider,
          QueryClientProvider,
          PostClientProvider,
          PostRepositoryProvider,
        ]}
      >
        {children}
      </MultiProvider>
    </ContextMapProvider>
  );
};
