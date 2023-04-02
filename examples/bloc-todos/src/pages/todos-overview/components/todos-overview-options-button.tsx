import { IconButton, Menu, MenuItem } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {
  TodosOverviewBloc,
  TodosOverviewClearCompletedRequested,
  TodosOverviewToggleAllRequested,
} from '../bloc';
import Icon from '@mui/material/Icon';
import { useBloc } from '@jacobtipp/react-bloc';

export function TodosOverviewOptionsButton() {
  const [todos, { add }] = useBloc(TodosOverviewBloc, {
    selector: (data) => data.todos,
  });

  const hasTodos = todos.length > 0;
  const completedTodosAmount = todos.filter((todo) => todo.isCompleted).length;

  return (
    <PopupState variant="popover" popupId="todos-overview-options-menu">
      {(popupState) => (
        <>
          <IconButton color="inherit" {...bindTrigger(popupState)}>
            <Icon>more_vert_rounded</Icon>
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              key="toggleAll"
              disabled={!hasTodos}
              onClick={() => {
                add(new TodosOverviewToggleAllRequested());
                popupState.close();
              }}
            >
              Mark all as{' '}
              {completedTodosAmount === todos.length
                ? 'incomplete'
                : 'complete'}
            </MenuItem>
            <MenuItem
              key="clearCompleted"
              disabled={!(hasTodos && completedTodosAmount > 0)}
              onClick={() => {
                add(new TodosOverviewClearCompletedRequested());
                popupState.close();
              }}
            >
              Clear completed
            </MenuItem>
          </Menu>
        </>
      )}
    </PopupState>
  );
}
