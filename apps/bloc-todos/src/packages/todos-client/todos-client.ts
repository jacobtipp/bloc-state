import { Observable } from 'rxjs';
import { QueryState } from '@jacobtipp/bloc-query';
import { Todo } from './model/todo';

export abstract class TodosClient {
  abstract getTodos(): Observable<QueryState<Todo[]>>;
  abstract saveTodo(todo: Todo): Promise<void>;
  abstract deleteTodo(id: string): Promise<void>;
  abstract getTodo(id: string): Observable<QueryState<Todo>>;
  abstract completeAll(isCompleted: boolean): Promise<number>;
  abstract clearCompleted(): Promise<number>;
}
