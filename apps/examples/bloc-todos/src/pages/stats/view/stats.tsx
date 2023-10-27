import {
  AppBar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import Icon from '@mui/material/Icon';
import { StatsSubscriptionRequested } from '../bloc/stats.event';
import Grid from '@mui/material/Unstable_Grid2';
import { StatsBloc } from '../bloc';
import { BlocProvider, useBlocValue } from '@jacobtipp/react-bloc';
import { todosRepository } from '../../../modules';

export default function StatsPage() {
  return (
    <BlocProvider
      bloc={StatsBloc}
      create={() =>
        new StatsBloc(todosRepository).add(new StatsSubscriptionRequested())
      }
    >
      <StatsView />
    </BlocProvider>
  );
}

export function StatsView() {
  const state = useBlocValue(StatsBloc);
  const { activeTodos, completedTodos } = state.data;

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stats
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        direction={'column'}
        sx={{ height: '100%' }}
        justifyContent={'center'}
      >
        <Grid>
          <List>
            <ListItem
              secondaryAction={<ListItemText primary={completedTodos} />}
            >
              <ListItemIcon>
                <Icon>check</Icon>
              </ListItemIcon>
              <ListItemText primary={'Completed todos'} />
            </ListItem>
            <ListItem secondaryAction={<ListItemText primary={activeTodos} />}>
              <ListItemIcon>
                <Icon>radio_button_unchecked</Icon>
              </ListItemIcon>
              <ListItemText primary={'Active todos'} />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </>
  );
}
