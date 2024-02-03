import {
  RootProvider,
  MultiProvider,
  Provider,
  RepositoryProvider,
  useProvider,
} from '@jacobtipp/react-bloc';
import { TodosRepository } from '@/packages/todos-repository/todos-repository';
import { LocalStorageTodosClient } from '@/packages/todos-client/local-storage-todos-client';
import { PropsWithChildren } from 'react';
import { TodosClient } from '@/packages/todos-client/todos-client';
import { QueryClient } from '@jacobtipp/bloc-query';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { AppBlocObserver } from '@/packages/app-bloc-observer/app-bloc-observer';
import { BlocObserver } from '@jacobtipp/bloc';
import {
  HydratedLocalStorage,
  HydratedStorage,
  Storage,
} from '@jacobtipp/hydrated-bloc';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const HydratedStorageProvider = ({ children }: PropsWithChildren) => (
  <Provider
    classDef={Storage}
    create={() => new HydratedLocalStorage()}
    onMount={(storage) => (HydratedStorage.storage = storage)}
  >
    {children}
  </Provider>
);

export const AppBlocObserverProvider = ({ children }: PropsWithChildren) => (
  <Provider
    classDef={BlocObserver}
    create={() => new AppBlocObserver()}
    onMount={(observer) => (BlocObserver.observer = observer)}
  >
    {children}
  </Provider>
);

export const ThemeProvider = ({ children }: PropsWithChildren) => (
  <MuiThemeProvider theme={darkTheme}>{children}</MuiThemeProvider>
);

export const QueryClientProvider = ({ children }: PropsWithChildren) => (
  <Provider
    classDef={QueryClient}
    create={() => new QueryClient()}
    children={children}
  />
);

export const TodosClientProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useProvider(QueryClient);
  return (
    <Provider
      classDef={TodosClient}
      create={() => new LocalStorageTodosClient(queryClient)}
      onMount={(todosClient) => {
        todosClient.getTodos();
      }}
    >
      {children}
    </Provider>
  );
};

export const TodosRepositoryProvider = ({ children }: PropsWithChildren) => {
  const todosClient = useProvider(TodosClient);
  return (
    <RepositoryProvider
      repository={TodosRepository}
      create={() => new TodosRepository(todosClient)}
    >
      {children}
    </RepositoryProvider>
  );
};

export const Providers = ({ children }: PropsWithChildren) => (
  <RootProvider>
    <MultiProvider
      providers={[
        AppBlocObserverProvider,
        HydratedStorageProvider,
        ThemeProvider,
        QueryClientProvider,
        TodosClientProvider,
        TodosRepositoryProvider,
      ]}
    >
      {children}
    </MultiProvider>
  </RootProvider>
);
