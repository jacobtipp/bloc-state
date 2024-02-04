import { Fab, AppBar, Toolbar, IconButton } from '@mui/material';
import Icon from '@mui/material/Icon';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function getRandomIntInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

export default function Homepage() {
  const navigate = useNavigate();
  const [stop, setStop] = useState(false);

  const router = useNavigate();

  useEffect(() => {
    const routes = [
      '/stats',
      '/',
      '/edit/a68c010d-64b8-4eb6-a784-6fd9cb30b75b',
      '/edit',
    ];

    if (stop) {
      return;
    }

    const intervalId = setInterval(() => {
      const rand = getRandomIntInclusive(0, routes.length);
      const route = routes[rand];
      if (route) {
        navigate(route);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [stop]);

  return (
    <>
      <Outlet />
      <AppBar
        onMouseOver={() => setStop(true)}
        color="primary"
        position="fixed"
        sx={{ bottom: 0, top: 'auto', paddingX: (theme) => theme.spacing(8) }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-around',
          }}
        >
          <IconButton
            color="inherit"
            onClick={() => {
              navigate('/');
            }}
          >
            <Icon>menu</Icon>
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/stats')}>
            <Icon>show_chart</Icon>
          </IconButton>
        </Toolbar>
        <Fab
          color="primary"
          onClick={() => navigate('/edit')}
          sx={{
            position: 'absolute',
            zIndex: 9999,
            top: -30,
            left: 0,
            right: 0,
            margin: '0 auto',
          }}
        >
          <Icon>add</Icon>
        </Fab>
      </AppBar>
    </>
  );
}
