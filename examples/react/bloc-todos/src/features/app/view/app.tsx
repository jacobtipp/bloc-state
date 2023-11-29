import { AppBar, createTheme, ThemeProvider, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import CircularLoader from '../../common/components/circular-loader';
import './app.css';
import { TodosRepository } from '../../../packages/todos-repository/todos-repository';
import { RepositoryProvider } from '@jacobtipp/react-bloc';

const HomePage = lazy(() => import('../../home/view/home'));
const StatsPage = lazy(() => import('../../stats/view/stats'));
const EditTodoPage = lazy(() => import('../../edit-todos/view/edit-todos'));
const TodosOverviewPage = lazy(
  () => import('../../todos-overview/view/todos-overview')
);

type AppProps = {
  todosRepository: TodosRepository;
};

export default function App({ todosRepository }: AppProps) {
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
