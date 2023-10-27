import { Todo } from '../../../modules/todos/domain/model/todo';
import { TodosOverviewFilter } from './todos-overview-filter';

export type TodosOverviewViewModel = {
  todos: Todo[];
  filter: TodosOverviewFilter;
  lastDeletedTodo?: Todo;
};
