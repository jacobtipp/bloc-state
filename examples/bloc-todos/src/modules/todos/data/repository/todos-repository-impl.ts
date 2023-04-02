import { Observable } from 'rxjs';
import { Todo } from '../../domain/model/todo';
import { TodosRepository } from '../../domain/repository/todos-repository';
import type { TodosResource } from '../resource/todos-resource';

export class TodosRepositoryImpl implements TodosRepository {
  constructor(private todosResource: TodosResource) {}

  getTodos = (): Observable<Todo[]> => this.todosResource.getTodos();

  getTodo = (id: string) => this.todosResource.getTodo(id);

  completeAll = async (isCompleted: boolean) =>
    await this.todosResource.completeAll(isCompleted);

  clearCompleted = async () => await this.todosResource.clearCompleted();

  saveTodo = async (todo: Todo) => await this.todosResource.saveTodo(todo);

  deleteTodo = async (id: string) => await this.todosResource.deleteTodo(id);
}
