import { Todo } from '../todos-client/model/todo';
import { TodosClient } from '../todos-client/todos-client';

export class TodosRepository {
  constructor(private todosClient: TodosClient) {}

  getTodos = () => this.todosClient.getTodos();

  getTodo = (id: string) => this.todosClient.getTodo(id);

  completeAll = async (isCompleted: boolean) =>
    this.todosClient.completeAll(isCompleted);

  clearCompleted = async () => this.todosClient.clearCompleted();

  saveTodo = async (todo: Todo) => this.todosClient.saveTodo(todo);

  deleteTodo = async (id: string) => this.todosClient.deleteTodo(id);
}
