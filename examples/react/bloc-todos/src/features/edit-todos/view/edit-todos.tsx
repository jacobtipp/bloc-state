import {
  AppBar,
  Toolbar,
  Fab,
  TextField,
  Container,
  IconButton,
  Box,
  Typography,
} from '@mui/material';

import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  EditTodoDescriptionChanged,
  EditTodoSubmitted,
  EditTodoSubscribed,
  EditTodoTitleChanged,
} from '../bloc/edit-todo.event';
import Icon from '@mui/material/Icon';
import { BlocProvider, useBloc, useBlocListener } from '@jacobtipp/react-bloc';
import { createSelector } from 'reselect';
import { EditTodoBloc } from '../bloc/edit-todo.bloc';
import { EditTodoState } from '../bloc/edit-todo.state';
import { todosRepository } from '../../../packages/todos-repository/todos-repository';

export default function EditTodoPage() {
  const { todoId } = useParams();

  return (
    <BlocProvider
      bloc={EditTodoBloc}
      create={() => {
        const editTodoBloc = new EditTodoBloc(todosRepository);
        if (todoId) editTodoBloc.add(new EditTodoSubscribed(todoId));
        return editTodoBloc;
      }}
    >
      <EditTodoView isNew={todoId === undefined} />
    </BlocProvider>
  );
}

export type EditTodoViewProps = {
  isNew: boolean;
};

const getData = (state: EditTodoState) => state.data;
const title = createSelector(getData, (data) => data.title);
const description = createSelector(getData, (data) => data.description);
const titleAndDescriptionSelector = createSelector(
  [title, description],
  (title, description) => {
    return [title, description];
  }
);

export function EditTodoView({ isNew }: EditTodoViewProps) {
  const navigate = useNavigate();
  const [[title, description], { add }] = useBloc(EditTodoBloc, {
    selector: titleAndDescriptionSelector,
  });

  useBlocListener(EditTodoBloc, {
    listenWhen(_previous, current) {
      return current.submitSuccess;
    },
    listener() {
      navigate('/');
    },
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title,
      description,
    },
  });

  const onSubmit = (_data: any) => add(new EditTodoSubmitted());

  return (
    <>
      <Container
        sx={{
          position: 'fixed',
          bottom: (theme) => theme.spacing(7),
          top: (theme) => theme.spacing(8),
          paddingY: (theme) => theme.spacing(3),
          left: '0',
          right: '0',
        }}
      >
        <AppBar position={'fixed'}>
          <Toolbar>
            <Box sx={{ flex: 1 }}>
              <IconButton color="inherit" onClick={() => navigate('/')}>
                <Icon>arrow_back</Icon>
              </IconButton>
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              {isNew ? 'Add Todo' : 'Edit Todo'}
            </Typography>
            <Box sx={{ flex: 1 }} />
          </Toolbar>
        </AppBar>
        <form id="edit-todos-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            rules={{
              required: true,
              minLength: {
                value: 1,
                message: 'Title must have at least one character.',
              },
            }}
            render={({ field: { onChange }, fieldState: { error } }) => {
              return (
                <TextField
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                  name="title"
                  variant="standard"
                  id="title"
                  label="title"
                  value={title}
                  onChange={(event) => {
                    onChange(event);
                    add(new EditTodoTitleChanged(event.target.value));
                  }}
                />
              );
            }}
          />
          <Controller
            name="description"
            control={control}
            rules={{
              required: true,
              minLength: {
                value: 1,
                message: 'Description must have at least one character.',
              },
            }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <TextField
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                name="description"
                variant="standard"
                id="description"
                label="description"
                value={description}
                multiline
                rows={10}
                margin="dense"
                onChange={(event) => {
                  onChange(event);
                  add(new EditTodoDescriptionChanged(event.target.value));
                }}
              />
            )}
          />
        </form>
      </Container>
      <Fab
        form="edit-todos-form"
        color="primary"
        type="submit"
        sx={{
          position: 'absolute',
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
      >
        <Icon>check_rounded</Icon>
      </Fab>
    </>
  );
}
