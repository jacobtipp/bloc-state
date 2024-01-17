import { TodosRepository } from '../../../packages/todos-repository/todos-repository';
import { StatsBloc } from './stats.bloc';
import {
  HydratedLocalStorage,
  HydratedStorage,
} from '@jacobtipp/hydrated-bloc';
import { MockProxy, mock } from 'jest-mock-extended';
import { StatsState } from './stats.state';
import { Subscription, of } from 'rxjs';
import { Todo } from '../../../packages/todos-client/model/todo';
import { StatsSubscriptionRequested } from './stats.event';

const delay = (num: number) =>
  new Promise((resolve) => setTimeout(resolve, num));

describe('StatsBloc', () => {
  let instance: StatsBloc;
  let mockTodosRepository: MockProxy<TodosRepository>;
  let mockHydratedStorage: MockProxy<HydratedLocalStorage>;
  let states: StatsState[];
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
    instance = new StatsBloc(mockTodosRepository);
    subscription = instance.state$.subscribe({
      next: (state) => states.push(state),
    });
  });

  afterEach(() => {
    instance.close();
    subscription.unsubscribe();
    jest.clearAllMocks();
  });

  it('instance should be an instanceof StatsBloc', () => {
    expect(instance instanceof StatsBloc).toBeTruthy();
  });

  describe('StatsSubscriptionRequested', () => {
    it('should emit [loading, ready] state when successful', async () => {
      expect.assertions(4);

      mockTodosRepository.getTodos.mockReturnValue(of(todos));
      instance.add(new StatsSubscriptionRequested());

      await delay(0);
      const [loading, ready] = states;

      expect(loading?.status).toBe('loading');
      expect(ready?.status).toBe('ready');
      expect(ready?.data.activeTodos).toBe(1);
      expect(ready?.data.completedTodos).toBe(1);
    });
  });
});
