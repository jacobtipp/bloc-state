import { TodosClient } from './todos-client';
import { Todo } from './model/todo';
import { QueryClient } from '@jacobtipp/bloc-query';

export class LocalStorageTodosClient implements TodosClient {
  constructor(private queryClient: QueryClient) {}

  getTodo = (id: string) => {
    return this.queryClient.getQuery<Todo>({
      queryKey: `todos/${id}`,
      queryFn: async () => this._getTodo(id),
    });
  };

  private _getTodo = async (id: string) => {
    const todos = await this.queryClient.getQueryData<Todo[]>(this.getTodos());

    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
      throw new TodoNotFoundException();
    }

    return todo;
  };

  getTodos = () => {
    return this.queryClient.getQuery<Todo[]>({
      queryKey: 'todos',
      queryFn: this._getTodos,
      staleTime: Infinity
    });
  };

  private _getTodos = async () => {
    const todos = localStorage.getItem('todos');

    if (todos != null) {
      return Promise.resolve<Todo[]>(JSON.parse(todos));
    } else {
      return Promise.resolve<Todo[]>([]);
    }
  };

  saveTodo = async (todo: Todo) => {
    const todos = [...(await this.queryClient.getQueryData<Todo[]>('todos'))];

    const id = todo.id;
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex >= 0) {
      todos[todoIndex] = todo;
    } else {
      todos.push(todo);
    }
    this.queryClient.setQueryData<Todo[]>('todos', todos);
    return localStorage.setItem('todos', JSON.stringify(todos));
  };

  deleteTodo = async (id: string) => {
    const todos = [...(await this.queryClient.getQueryData<Todo[]>('todos'))];
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    console.log(todos);
    if (todoIndex === -1) {
      throw new TodoNotFoundException();
    } else {
      todos.splice(todoIndex, 1);
      this.queryClient.setQueryData<Todo[]>('todos', todos);
      return localStorage.setItem('todos', JSON.stringify(todos));
    }
  };

  clearCompleted = async () => {
    const todos = [...(await this.queryClient.getQueryData<Todo[]>('todos'))];
    const completedTodosAmount = todos.filter(
      (todo) => todo.isCompleted
    ).length;

    const newTodos = todos.filter((todo) => !todo.isCompleted);
    this.queryClient.setQueryData<Todo[]>('todos', newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return completedTodosAmount;
  };

  completeAll = async (isCompleted: boolean) => {
    const todos = [...(await this.queryClient.getQueryData<Todo[]>('todos'))];
    const changedTodosAmount = todos.filter(
      (todo) => todo.isCompleted !== isCompleted
    ).length;
    const newTodos = todos.map((todo) => ({ ...todo, isCompleted }));
    this.queryClient.setQueryData<Todo[]>('todos', newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return changedTodosAmount;
  };
}

export class TodoNotFoundException extends Error {}
