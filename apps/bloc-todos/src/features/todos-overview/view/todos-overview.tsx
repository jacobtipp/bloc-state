import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Container,
} from '@mui/material';
import Icon from '@mui/material/Icon';

import { useNavigate } from 'react-router-dom';
import { TodosOverviewOptionsButton } from '../components/todos-overview-options-button';
import { TodosOverviewFilterButton } from '../components/todos-overview-filter-button';
import { TodosOverviewEmptyText } from '../components/todos-overview-empty-text';
import { Todo } from '../../../packages/todos-client/model/todo';
import {
  BlocProvider,
  useBloc,
  useBlocSelector,
  useRepository,
} from '@jacobtipp/react-bloc';
import { TodosOverviewBloc } from '../bloc/todos-overview.bloc';
import {
  TodosOverviewSubscriptionRequested,
  TodosOverviewTodoDeleted,
  TodosOverviewTodoCompletionToggled,
} from '../bloc/todos-overview.event';
import { TodosOverviewFilter } from '../model/todos-overview-filter';
import { TodosRepository } from '../../../packages/todos-repository/todos-repository';
import { TodosOverViewSnackbar } from '../components/todos-overview-snackbar';

const todoFilterMap = (todo: Todo, filter: TodosOverviewFilter) =>
  filter === 'all'
    ? true
    : filter === 'completed'
    ? todo.isCompleted
    : !todo.isCompleted;

export default function TodosOverviewPage() {
  const todosRepository = useRepository(TodosRepository);

  return (
    <BlocProvider
      bloc={TodosOverviewBloc}
      create={() => new TodosOverviewBloc(todosRepository)}
      onMount={(todosOverviewBloc) =>
        todosOverviewBloc.add(new TodosOverviewSubscriptionRequested())
      }
      dependencies={[todosRepository]}
    >
      <TodosOverViewSnackbar />
      <TodosOverviewView />
    </BlocProvider>
  );
}

export function TodosOverviewView() {
  const filter = useBlocSelector(TodosOverviewBloc, {
    selector: (state) => state.data.filter,
  });
  const [filteredTodos, { add }] = useBloc(TodosOverviewBloc, {
    selector: (state) =>
      state.data.todos.filter((todo) => todoFilterMap(todo, filter)),
  });

  const navigate = useNavigate();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bloc Todos
          </Typography>
          <TodosOverviewFilterButton />
          <TodosOverviewOptionsButton />
        </Toolbar>
      </AppBar>
      <Container>
        {filteredTodos.length > 0 ? (
          <List sx={{ paddingY: (theme) => theme.spacing(8) }}>
            {filteredTodos.map((todo) => {
              const labelId = `checkbox-list-label-${todo.id}`;
              return (
                <ListItem
                  key={todo.id}
                  secondaryAction={
                    <IconButton
                      color="inherit"
                      edge="end"
                      aria-label="delete"
                      onClick={() => add(new TodosOverviewTodoDeleted(todo))}
                    >
                      <Icon>delete</Icon>
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton role={undefined}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={todo.isCompleted}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        onClick={() =>
                          add(
                            new TodosOverviewTodoCompletionToggled(
                              todo,
                              !todo.isCompleted
                            )
                          )
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={labelId}
                      primary={todo.title}
                      sx={{
                        textDecoration: todo.isCompleted ? 'line-through' : '',
                      }}
                      onClick={() => navigate(`/edit/${todo.id}`)}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <TodosOverviewEmptyText />
        )}
      </Container>
    </>
  );
}
