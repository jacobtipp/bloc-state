import { AppBar, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { CircularLoader } from '@/lib/app-ui/components/circular-loader';

import './app.css';
import { Providers } from './providers';

const HomePage = lazy(() => import('@/features/home/view/home'));
const StatsPage = lazy(() => import('@/features/stats/view/stats'));
const EditTodoPage = lazy(
  () => import('@/features/edit-todos/view/edit-todos')
);
const TodosOverviewPage = lazy(
  () => import('../../todos-overview/view/todos-overview')
);

export default function App() {
  return (
    <Providers>
      <AppView />
    </Providers>
  );
}

const AppBarPlaceHolder = () => (
  <AppBar position="fixed" sx={{ zIndex: -1 }}>
    <Toolbar />
  </AppBar>
);

function AppView() {
  return (
    <>
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
    </>
  );
}
