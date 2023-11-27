import { Observable } from 'rxjs';
import { Todo } from '../todos-client/model/todo';
import { localStorageTodosClient } from '../todos-client/local-storage-todos-client';
import { TodosClient } from '../todos-client/todos-client';

export class TodosRepository {
  constructor(private todosResource: TodosClient) {}

  getTodos = (): Observable<Todo[]> => this.todosResource.getTodos();

  getTodo = (id: string) => this.todosResource.getTodo(id);

  completeAll = async (isCompleted: boolean) =>
    await this.todosResource.completeAll(isCompleted);

  clearCompleted = async () => await this.todosResource.clearCompleted();

  saveTodo = async (todo: Todo) => await this.todosResource.saveTodo(todo);

  deleteTodo = async (id: string) => await this.todosResource.deleteTodo(id);
}

export const todosRepository = new TodosRepository(localStorageTodosClient);
