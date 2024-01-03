import { MockProxy, mock } from 'jest-mock-extended';
import { TodosOverviewBloc } from './todos-overview.bloc';
import {
  GetTodosFailure,
  TodosRepository,
} from '../../../packages/todos-repository/todos-repository';
import {
  HydratedLocalStorage,
  HydratedStorage,
} from '@jacobtipp/hydrated-bloc';
import { Observable, of, Subscription } from 'rxjs';
import { Todo } from '../../../packages/todos-client/model/todo';
import { TodosOverviewState } from './todos-overview.state';
import {
  TodosOverviewFilterChanged,
  TodosOverviewSubscriptionRequested,
  TodosOverviewTodoCompletionToggled,
  TodosOverviewTodoDeleted,
  TodosOverviewUndoDeletionRequested,
} from './todos-overview.event';

const delay = (num: number) =>
  new Promise((resolve) => setTimeout(resolve, num));

describe('TodosOverviewBloc', () => {
  let instance: TodosOverviewBloc;
  let mockTodosRepository: MockProxy<TodosRepository>;
  let mockHydratedStorage: MockProxy<HydratedLocalStorage>;
  let states: TodosOverviewState[];
  let subscription: Subscription;

  const firstTodo: Todo = {
    id: '1',
    title: 'first todo',
    description: 'first todo description',
    isCompleted: false,
  };

  const secondTodo: Todo = {
    id: '2',
    title: 'second todo',
    description: 'second todo description',
    isCompleted: true,
  };

  const todos: Todo[] = [firstTodo, secondTodo];

  beforeEach(() => {
    states = [];
    mockHydratedStorage = mock<HydratedLocalStorage>();
    HydratedStorage.storage = mockHydratedStorage;
    mockTodosRepository = mock<TodosRepository>();
    instance = new TodosOverviewBloc(mockTodosRepository);
    subscription = instance.state$.subscribe({
      next: (state) => states.push(state),
    });
  });

  afterEach(() => {
    instance.close();
    subscription.unsubscribe();
    jest.clearAllMocks();
  });

  it('instance should be an instanceof TodosOverviewBloc', () => {
    expect.assertions(1);
    expect(instance instanceof TodosOverviewBloc).toBeTruthy();
  });

  describe('TodosOverviewSubscriptionRequested', () => {
    it('should emit [loading, ready] state when successful', async () => {
      expect.assertions(3);

      mockTodosRepository.getTodos.mockReturnValue(of(todos));
      instance.add(new TodosOverviewSubscriptionRequested());

      await delay(0);
      const [loading, ready] = states;

      expect(loading?.status).toBe('loading');
      expect(ready?.status).toBe('ready');
      expect(ready?.data.todos).toStrictEqual(todos);
    });

    it('should emit [loading, failed] state when failure', async () => {
      expect.assertions(4);

      const failedTodos = new Observable<Todo[]>((observer) => {
        observer.error(new GetTodosFailure());
      });

      mockTodosRepository.getTodos.mockReturnValue(failedTodos);
      instance.add(new TodosOverviewSubscriptionRequested());

      await delay(0);
      const [loading, failed] = states;

      expect(loading?.status).toBe('loading');
      expect(failed?.status).toBe('failed');
      expect(failed?.error).toBeInstanceOf(GetTodosFailure);
      expect(failed?.data.todos).toStrictEqual([]);
    });
  });

  describe('TodosOverviewCompletionToggled', () => {
    it('should toggle isCompleted for a todo', async () => {
      expect.assertions(1);

      instance.add(
        new TodosOverviewTodoCompletionToggled(
          firstTodo,
          !firstTodo.isCompleted
        )
      );
      await delay(0);
      expect(mockTodosRepository.saveTodo).toBeCalledWith({
        ...firstTodo,
        isCompleted: !firstTodo.isCompleted,
      });
    });
  });

  describe('TodosOverviewFilterChanged', () => {
    it('should emit [ready] with completed filter', async () => {
      expect.assertions(3);

      expect(instance.state.data.filter).toBe('all');
      instance.add(new TodosOverviewFilterChanged('completed'));
      await delay(0);
      const [ready] = states;
      expect(ready?.status).toBe('ready');
      expect(ready?.data.filter).toBe('completed');
    });
  });

  describe('TodosOverviewTodoDeleted', () => {
    it('should emit [ready] with lastDeletedTodo', async () => {
      expect.assertions(4);

      expect(instance.state.data.lastDeletedTodo).toBeUndefined();
      instance.add(new TodosOverviewTodoDeleted(firstTodo));
      await delay(0);
      const [ready] = states;
      expect(mockTodosRepository.deleteTodo).toBeCalledWith(firstTodo.id);
      expect(ready?.status).toBe('ready');
      expect(ready?.data.lastDeletedTodo).toBe(firstTodo);
    });
  });

  describe('TodosOverviewUndoDeletedRequested', () => {
    it('should not emit when lastDeletedTodo is undefined', async () => {
      expect.assertions(2);

      expect(instance.state.data.lastDeletedTodo).toBeUndefined();
      instance.add(new TodosOverviewUndoDeletionRequested());
      await delay(0);
      expect(mockTodosRepository.saveTodo).not.toBeCalled();
    });

    it('should emit [ready] with lastDeletedTodo removed', async () => {
      expect.assertions(4);

      instance.add(new TodosOverviewTodoDeleted(firstTodo));
      await delay(0);
      expect(mockTodosRepository.deleteTodo).toBeCalledWith(firstTodo.id);

      instance.add(new TodosOverviewUndoDeletionRequested());
      await delay(0);
      expect(mockTodosRepository.saveTodo).toBeCalled();
      const [_, ready] = states;
      expect(ready?.status).toBe('ready');
      expect(ready?.data.lastDeletedTodo).toBeUndefined();
    });
  });

  /*private async onToggleAllRequested(
    _event: TodosOverviewToggleAllRequested,
    _emit: Emitter<TodosOverviewState>
  ): Promise<void> {
    const areAllCompleted = this.state.data.todos.every(
      (todo) => todo.isCompleted
    );
    await this.todosRepository.completeAll(!areAllCompleted);
  }*/

  describe('TodosOverviewToggleAllRequested', () => {
    it('should toggle isCompleted for a todo', async () => {
      expect.assertions(1);

      instance.add(
        new TodosOverviewTodoCompletionToggled(
          firstTodo,
          !firstTodo.isCompleted
        )
      );
      await delay(0);
      expect(mockTodosRepository.saveTodo).toBeCalledWith({
        ...firstTodo,
        isCompleted: !firstTodo.isCompleted,
      });
    });
  });
});
