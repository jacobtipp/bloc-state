import { Observable } from 'rxjs';
import { Todo } from '../todos-client/model/todo';
import { TodosClient } from '../todos-client/todos-client';
import { QueryClient, QueryState } from '@jacobtipp/bloc-query';

export class TodosRepository extends QueryClient {
  constructor(private todosClient: TodosClient) {
    super();
  }

  getTodos = (): Observable<QueryState<Todo[]>> => {
    return this.getQuery<Todo[]>({
      queryKey: 'todos',
      queryFn: () => this.todosClient.getTodos(),
    });
  };

  getTodo = (id: string) => {
    return this.getQuery<Todo>({
      queryKey: `todos/${id}`,
      queryFn: () => this.todosClient.getTodo(id),
    });
  };

  completeAll = async (isCompleted: boolean) => {
    await this.todosClient.completeAll(isCompleted);
    this.revalidateQueries({
      queryKey: 'todos',
    });
  };

  clearCompleted = async () => {
    await this.todosClient.clearCompleted();
    this.revalidateQueries({
      queryKey: 'todos',
    });
  };

  saveTodo = async (todo: Todo) => {
    await this.todosClient.saveTodo(todo);
    this.revalidateQueries({
      queryKey: 'todos',
    });
  };

  deleteTodo = async (id: string) => {
    await this.todosClient.deleteTodo(id);
    this.setQueryData<Todo[]>('todos', (old) => {
      const todos = [...old];
      const todoIndex = todos.findIndex((todo) => todo.id === id);
      todos.splice(todoIndex, 1);
      return todos;
    });
  };
}
