import { Observable } from 'rxjs';
import { Todo } from './model/todo';

export interface TodosClient {
  getTodos(): Observable<Todo[]>;
  saveTodo(todo: Todo): Promise<void>;
  deleteTodo(id: string): Promise<void>;
  getTodo(id: string): Promise<Todo>;
  completeAll(isCompleted: boolean): Promise<number>;
  clearCompleted(): Promise<number>;
}
