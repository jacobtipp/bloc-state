import { Observable } from 'rxjs';
import { Todo } from '../todos-client/model/todo';
import { TodosClient } from '../todos-client/todos-client';

export class TodosRepository {
  constructor(private todosClient: TodosClient) {}

  getTodos = (): Observable<Todo[]> => this.todosClient.getTodos();

  getTodo = (id: string) => this.todosClient.getTodo(id);

  completeAll = async (isCompleted: boolean) =>
    await this.todosClient.completeAll(isCompleted);

  clearCompleted = async () => await this.todosClient.clearCompleted();

  saveTodo = async (todo: Todo) => await this.todosClient.saveTodo(todo);

  deleteTodo = async (id: string) => await this.todosClient.deleteTodo(id);
}
