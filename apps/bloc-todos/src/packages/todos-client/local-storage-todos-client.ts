import { TodosClient } from './todos-client';
import { Todo } from './model/todo';
import { QueryClient } from '@jacobtipp/bloc-query';
import { Observable } from 'rxjs';

export class TodosApiFailure extends Error {
  override name = 'TodosApiFailure';
  constructor(message: string, cause?: unknown) {
    super(message, { cause });

    Object.setPrototypeOf(this, TodosApiFailure.prototype);
  }
}

/**
 * Custom error class indicating that a Todo with a specific ID was not found.
 * @extends {TodosApiFailure}
 * @param {string} id - The ID of the Todo that was not found.
 */
export class TodoNotFoundException extends TodosApiFailure {
  override name = 'TodosNotFoundException';
  constructor(id: string) {
    super(`Todo with id ${id} was not found.`);
    Object.setPrototypeOf(this, TodoNotFoundException.prototype);
  }
}

/**
 * Custom error class indicating a failure during the parsing of Todos JSON from storage.
 * @extends {TodosApiFailure}
 * @param {unknown} [cause] - The optional cause of the parsing failure.
 */
export class TodosParsingFailure extends TodosApiFailure {
  override name = 'TodosParsingFailure';
  constructor(cause?: unknown) {
    super('Failure parsing todos JSON from storage', { cause });
    Object.setPrototypeOf(this, TodosParsingFailure.prototype);
  }
}

/**
 * Implementation of the TodosClient interface that interacts with local storage.
 * @implements {TodosClient}
 * @param {QueryClient} queryClient - The query client for managing state.
 * @param {Storage} storage - The storage interface for persisting Todos.
 */
export class LocalStorageTodosClient extends TodosClient {
  constructor(
    private readonly queryClient: QueryClient,
    private readonly storage: Storage = localStorage
  ) {
    super();
    // Initialize Todos by retrieving them from storage
    this.getTodos();
  }

  /**
   * Retrieves a specific Todo by its ID.
   * @param {string} id - The ID of the Todo to retrieve.
   * @returns {Promise<Todo>} - The retrieved Todo.
   * @throws {TodoNotFoundException} - If the Todo with the specified ID is not found.
   */
  async getTodo(id: string): Promise<Todo> {
    const todos = await this.queryClient.getQueryData<Todo[]>('todos');
    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
      throw new TodoNotFoundException(id);
    }

    return todo;
  }

  /**
   * Retrieves all Todos as an observable.
   * @returns {Observable<Todo[]>} - An observable containing the Todos.
   */
  getTodos(): Observable<Todo[]> {
    return this.queryClient.getQuery({
      queryKey: 'todos',
      queryFn: async () => {
        const todos = this.storage.getItem('todos');
        try {
          return (todos !== null ? JSON.parse(todos) : []) as Todo[];
        } catch (e) {
          throw new TodosParsingFailure(e);
        }
      },
      selector: (state) => state.data,
      staleTime: Infinity,
    });
  }

  /**
   * Saves a Todo to storage.
   * @param {Todo} todo - The Todo to save.
   * @returns {Promise<void>} - A promise indicating the success of the operation.
   */
  async saveTodo(todo: Todo): Promise<void> {
    const todos = [...(await this.queryClient.getQueryData<Todo[]>('todos'))];
    const id = todo.id;
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex >= 0) {
      todos[todoIndex] = todo;
    } else {
      todos.push(todo);
    }

    this.queryClient.setQueryData<Todo[]>('todos', todos);
    return this.storage.setItem('todos', JSON.stringify(todos));
  }

  /**
   * Deletes a Todo from storage.
   * @param {string} id - The ID of the Todo to delete.
   * @returns {Promise<void>} - A promise indicating the success of the operation.
   * @throws {TodoNotFoundException} - If the Todo with the specified ID is not found.
   */
  async deleteTodo(id: string): Promise<void> {
    const todos = [...(await this.queryClient.getQueryData<Todo[]>('todos'))];
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      throw new TodoNotFoundException(id);
    } else {
      todos.splice(todoIndex, 1);
      this.queryClient.setQueryData<Todo[]>('todos', todos);
      return this.storage.setItem('todos', JSON.stringify(todos));
    }
  }
  /**
   * Clears completed Todos from storage.
   * @returns {Promise<number>} - The number of completed Todos cleared.
   */
  async clearCompleted(): Promise<number> {
    const todos = [...(await this.queryClient.getQueryData<Todo[]>('todos'))];
    const completedTodosAmount = todos.filter(
      (todo) => todo.isCompleted
    ).length;
    const newTodos = todos.filter((todo) => !todo.isCompleted);
    this.queryClient.setQueryData<Todo[]>('todos', newTodos);
    this.storage.setItem('todos', JSON.stringify(newTodos));
    return completedTodosAmount;
  }

  /**
   * Marks all Todos as completed or not completed.
   * @param {boolean} isCompleted - If true, marks all Todos as completed; otherwise, marks them as not completed.
   * @returns {Promise<number>} - The number of Todos affected.
   */
  async completeAll(isCompleted: boolean): Promise<number> {
    const todos = [...(await this.queryClient.getQueryData<Todo[]>('todos'))];
    const changedTodosAmount = todos.filter(
      (todo) => todo.isCompleted !== isCompleted
    ).length;
    const newTodos = todos.map((todo) => ({ ...todo, isCompleted }));
    this.queryClient.setQueryData<Todo[]>('todos', newTodos);
    this.storage.setItem('todos', JSON.stringify(newTodos));
    return changedTodosAmount;
  }
}
