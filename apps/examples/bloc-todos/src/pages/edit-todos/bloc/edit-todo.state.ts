import { State } from '@jacobtipp/state';
import { EditTodoViewModel } from '../model/edit-todo';

export class EditTodoState extends State<EditTodoViewModel> {
  submitSuccess = false;
}
