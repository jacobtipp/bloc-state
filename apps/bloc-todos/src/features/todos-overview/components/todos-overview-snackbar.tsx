import { useBlocInstance, BlocListener } from '@jacobtipp/react-bloc';
import { Snackbar, Button } from '@mui/material';
import { useState, useMemo } from 'react';
import { TodosOverviewBloc } from '../bloc/todos-overview.bloc';
import { TodosOverviewUndoDeletionRequested } from '../bloc/todos-overview.event';

export function TodosOverViewSnackbar() {
  const [isSnackbarOpen, openSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { add } = useBlocInstance(TodosOverviewBloc);

  const handleCloseSnackbar = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    openSnackbar(false);
  };

  const action = useMemo(() => {
    return (
      <Button
        color="secondary"
        size="small"
        onClick={(e) => {
          handleCloseSnackbar(e);
          add(new TodosOverviewUndoDeletionRequested());
        }}
      >
        UNDO
      </Button>
    );
  }, [add]);

  return (
    <BlocListener
      bloc={TodosOverviewBloc}
      listenWhen={(previous, current) => {
        return (
          previous.data.lastDeletedTodo !== current.data.lastDeletedTodo &&
          current.data.lastDeletedTodo !== undefined
        );
      }}
      listener={(_bloc, state) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deletedTodo = state.data.lastDeletedTodo!;
        setSnackbarMessage(`Todo "${deletedTodo.title}" deleted.`);
        openSnackbar(false); // close any snackbars that may be open
        openSnackbar(true); // open snackbar
      }}
    >
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
        sx={{ bottom: { xs: 100, sm: 100 } }}
      />
    </BlocListener>
  );
}
