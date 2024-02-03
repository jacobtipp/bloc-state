import { Todo } from '@/packages/todos-client/model/todo';
import { TodosOverviewFilter } from './todos-overview-filter';

export type TodosOverview = {
  todos: Todo[];
  filter: TodosOverviewFilter;
  lastDeletedTodo?: Todo;
};
