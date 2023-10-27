import { Fab, AppBar, Toolbar, IconButton } from '@mui/material';
import Icon from '@mui/material/Icon';
import { Outlet, useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <>
      <Outlet />
      <AppBar
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
