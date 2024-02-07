import { Todo } from '../todos-client/model/todo';
import { TodosClient } from '../todos-client/todos-client';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Custom error class for generic Todos-related failures.
 *
 * @extends {Error}
 * @param {string} message - The error message.
 * @param {unknown} [cause] - The optional cause of the error.
 */
export class TodosFailure extends Error {
  override name = 'TodosFailure';
  constructor(message: string, cause?: unknown) {
    super(message, { cause });

    Object.setPrototypeOf(this, TodosFailure.prototype);
  }
}

/**
 * Custom error class for failures during the retrieval of Todos.
 *
 * @extends {TodosFailure}
 * @param {unknown} [cause] - The optional cause of the error.
 */
export class GetTodosFailure extends TodosFailure {
  override name = 'GetTodosFailure';
  constructor(cause?: unknown) {
    super('Failed to getTodos', { cause });

    Object.setPrototypeOf(this, GetTodosFailure.prototype);
  }
}

/**
 * Custom error class for failures during the deletion of a Todo.
 *
 * @extends {TodosFailure}
 * @param {string} id - The ID of the Todo being deleted.
 * @param {unknown} [cause] - The optional cause of the error.
 */
export class DeleteTodoFailure extends TodosFailure {
  override name = 'DeleteTodoFailure';
  constructor(id: string, cause?: unknown) {
    super(`Failed to deleteTodo ${id}`, { cause });

    Object.setPrototypeOf(this, DeleteTodoFailure.prototype);
  }
}

/**
 * Custom error class for failures during the retrieval of a specific Todo.
 *
 * @extends {TodosFailure}
 * @param {string} id - The ID of the Todo being retrieved.
 * @param {unknown} [cause] - The optional cause of the error.
 */
export class GetTodoFailure extends TodosFailure {
  override name = 'GetTodoFailure';
  constructor(id: string, cause?: unknown) {
    super(`Failed to getTodo ${id}`, { cause });

    Object.setPrototypeOf(this, GetTodoFailure.prototype);
  }
}

/**
 * Repository class for handling interactions with Todos.
 *
 * @class TodosRepository
 * @param {TodosClient} private todosClient - The client for interacting with Todos.
 */
export class TodosRepository {
  constructor(private todosClient: TodosClient) {}

  /**
   * Retrieves all Todos.
   *
   * @returns {Observable<Todo[]>} - An observable containing the Todos.
   * @throws {GetTodosFailure} - If there's an error during retrieval.
   */
  getTodos(): Observable<Todo[]> {
    return this.todosClient.getTodos().pipe(
      catchError((error: Error) => {
        return throwError(() => new GetTodosFailure(error));
      })
    );
  }

  /**
   * Retrieves a specific Todo.
   *
   * @param {string} id - The ID of the Todo to retrieve.
   * @returns {Promise<Todo>} - The retrieved Todo.
   * @throws {GetTodoFailure} - If there's an error during retrieval.
   */
  async getTodo(id: string): Promise<Todo> {
    try {
      return await this.todosClient.getTodo(id);
    } catch (e) {
      throw new GetTodoFailure(id, e);
    }
  }

  /**
   * Marks all Todos as completed or not completed.
   *
   * @param {boolean} isCompleted - If true, marks all Todos as completed; otherwise, marks them as not completed.
   * @returns {Promise<number>} - The number of Todos affected.
   */
  completeAll(isCompleted: boolean): Promise<number> {
    return this.todosClient.completeAll(isCompleted);
  }

  /**
   * Clears completed Todos.
   *
   * @returns {Promise<number>} - The number of Todos cleared.
   */
  clearCompleted(): Promise<number> {
    return this.todosClient.clearCompleted();
  }

  /**
   * Saves a Todo.
   *
   * @param {Todo} todo - The Todo to save.
   * @returns {Promise<void>} - A promise indicating the success of the operation.
   */
  saveTodo(todo: Todo): Promise<void> {
    return this.todosClient.saveTodo(todo);
  }

  /**
   * Deletes a Todo.
   *
   * @param {string} id - The ID of the Todo to delete.
   * @returns {Promise<void>} - A promise indicating the success of the operation.
   * @throws {DeleteTodoFailure} - If there's an error during deletion.
   */
  async deleteTodo(id: string): Promise<void> {
    try {
      await this.todosClient.deleteTodo(id);
    } catch (e) {
      throw new DeleteTodoFailure(id, e);
    }
  }
}
