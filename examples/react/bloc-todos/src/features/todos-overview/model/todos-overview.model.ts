import { Todo } from '@/lib/todos-client/model/todo';
import { TodosOverviewFilter } from './todos-overview-filter';

export type TodosOverview = {
  todos: Todo[];
  filter: TodosOverviewFilter;
  lastDeletedTodo?: Todo;
};
