import { AppBar, createTheme, ThemeProvider, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import { RepositoryProvider } from '@jacobtipp/react-bloc';
import { QueryClient } from '@jacobtipp/bloc-query';
import { CircularLoader } from '../../../packages/app-ui/components/circular-loader';
import { TodosRepository } from '../../../packages/todos-repository/todos-repository';
import { LocalStorageTodosClient } from '../../../packages/todos-client/local-storage-todos-client';

import './app.css';

const HomePage = lazy(() => import('../../../features/home/view/home'));
const StatsPage = lazy(() => import('../../../features/stats/view/stats'));
const EditTodoPage = lazy(
  () => import('../../../features/edit-todos/view/edit-todos')
);
const TodosOverviewPage = lazy(
  () => import('../../todos-overview/view/todos-overview')
);

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [localStorageTodosClient] = useState(
    () => new LocalStorageTodosClient(queryClient, localStorage)
  );
  const [todosRepository] = useState(
    () => new TodosRepository(localStorageTodosClient)
  );

  return (
    <RepositoryProvider
      repository={TodosRepository}
      create={() => todosRepository}
    >
      <AppView />
    </RepositoryProvider>
  );
}

const AppBarPlaceHolder = () => (
  <AppBar position="fixed" sx={{ zIndex: -1 }}>
    <Toolbar />
  </AppBar>
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function AppView() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Suspense fallback={<CircularLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route index element={<TodosOverviewPage />} />
            <Route path="stats">
              <Route index element={<StatsPage />} />
            </Route>
          </Route>
          <Route path="edit" element={<EditTodoPage />}>
            <Route index path=":todoId" />
          </Route>
        </Routes>
        <AppBarPlaceHolder />
      </Suspense>
    </ThemeProvider>
  );
}
