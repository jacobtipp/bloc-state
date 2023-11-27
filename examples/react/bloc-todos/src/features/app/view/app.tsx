import { AppBar, createTheme, ThemeProvider, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes } from 'react-router-dom';
import { lazy, PropsWithChildren, Suspense } from 'react';
import CircularLoader from '../../common/components/circular-loader';
import './app.css';
import {
  HydratedLocalStorage,
  HydratedStorage,
} from '@jacobtipp/hydrated-bloc';

const HomePage = lazy(() => import('../../home/view/home'));
const StatsPage = lazy(() => import('../../stats/view/stats'));
const TodosOverviewPage = lazy(
  () => import('../../todos-overview/view/todos-overview')
);
const EditTodoPage = lazy(() => import('../../edit-todos/view/edit-todos'));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

HydratedStorage.storage = new HydratedLocalStorage();

function GlobalProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <GlobalProviders>
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
    </GlobalProviders>
  );
}

const AppBarPlaceHolder = () => (
  <AppBar position="fixed" sx={{ zIndex: -1 }}>
    <Toolbar />
  </AppBar>
);
