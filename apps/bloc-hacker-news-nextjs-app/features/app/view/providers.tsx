'use client';
import { QueryClient } from '@jacobtipp/bloc-query';
import {
  MultiProvider,
  Provider,
  RepositoryProvider,
  useProvider,
  RootProvider,
} from '@jacobtipp/react-bloc';
import { PropsWithChildren } from 'react';
import { BlocObserver, isClient } from '@jacobtipp/bloc';
import { AppBlocObserver } from '@bloc-hn-nextjs-app/lib/app-bloc-observer/app-bloc-observer';
import { PostApiClient } from '@bloc-hn-nextjs-app/lib/post-client/post-api-client';
import { PostClient } from '@bloc-hn-nextjs-app/lib/post-client/post-client';
import { PostRepository } from '@bloc-hn-nextjs-app/lib/post-repository/post-repository';

export const AppBlocObserverProvider = ({ children }: PropsWithChildren) => (
  <Provider
    classDef={BlocObserver}
    create={() => {
      if (isClient()) {
        const observer = new AppBlocObserver();
        BlocObserver.observer = observer;
        return observer;
      } else {
        return BlocObserver.observer;
      }
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
  return (
    <Provider classDef={PostClient} create={() => new PostApiClient()}>
      {children}
    </Provider>
  );
};

const PostRepositoryProvider = ({ children }: PropsWithChildren) => {
  const postClient = useProvider(PostClient);
  const queryClient = useProvider(QueryClient);
  return (
    <RepositoryProvider
      repository={PostRepository}
      create={() => new PostRepository(postClient, queryClient)}
      dependencies={[postClient, queryClient]}
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
