import { IconButton, Menu, MenuItem } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Icon from '@mui/material/Icon';
import { useBlocInstance } from '@jacobtipp/react-bloc';
import { TodosOverviewBloc } from '../bloc/todos-overview.bloc';
import { TodosOverviewFilterChanged } from '../bloc/todos-overview.event';

export function TodosOverviewFilterButton() {
  const { add } = useBlocInstance(TodosOverviewBloc);

  return (
    <PopupState variant="popover" popupId="todos-overview-filter-menu">
      {(popupState) => (
        <>
          <IconButton color="inherit" {...bindTrigger(popupState)}>
            <Icon>filter_list</Icon>
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              key="filterChangedAll"
              onClick={() => {
                add(new TodosOverviewFilterChanged('all'));
                popupState.close();
              }}
            >
              All
            </MenuItem>
            <MenuItem
              key="filterChangedIncomplted"
              onClick={() => {
                add(new TodosOverviewFilterChanged('incompleted'));
                popupState.close();
              }}
            >
              Active only
            </MenuItem>
            <MenuItem
              key="filterChangedCompleted"
              onClick={() => {
                add(new TodosOverviewFilterChanged('completed'));
                popupState.close();
              }}
            >
              Completed only
            </MenuItem>
          </Menu>
        </>
      )}
    </PopupState>
  );
}
