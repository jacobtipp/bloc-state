import {
  GetTodoFailure,
  TodosRepository,
} from '../../../packages/todos-repository/todos-repository';
import {
  HydratedLocalStorage,
  HydratedStorage,
} from '@jacobtipp/hydrated-bloc';
import { MockProxy, mock } from 'jest-mock-extended';
import { Subscription } from 'rxjs';
import { EditTodoBloc } from './edit-todo.bloc';
import { Todo } from '../../../packages/todos-client/model/todo';
import { EditTodoState } from './edit-todo.state';
import {
  EditTodoDescriptionChanged,
  EditTodoSubmitted,
  EditTodoSubscribed,
  EditTodoTitleChanged,
} from './edit-todo.event';

const delay = (num: number) =>
  new Promise((resolve) => setTimeout(resolve, num));

describe('EditTodoBloc', () => {
  let instance: EditTodoBloc;
  let mockTodosRepository: MockProxy<TodosRepository>;
  let mockHydratedStorage: MockProxy<HydratedLocalStorage>;
  let states: EditTodoState[];
  let subscription: Subscription;

  const firstTodo: Todo = {
    id: '1',
    title: 'first todo',
    description: 'first todo description',
    isCompleted: false,
  };

  beforeEach(() => {
    states = [];
    mockHydratedStorage = mock<HydratedLocalStorage>();
    HydratedStorage.storage = mockHydratedStorage;
    mockTodosRepository = mock<TodosRepository>();
    instance = new EditTodoBloc(mockTodosRepository);
    subscription = instance.state$.subscribe({
      next: (state) => states.push(state),
    });
  });

  afterEach(() => {
    instance.close();
    subscription.unsubscribe();
    jest.clearAllMocks();
  });

  it('instance should be an instanceof EditTodoBloc', () => {
    expect(instance instanceof EditTodoBloc).toBeTruthy();
  });

  describe('StatsSubscriptionRequested', () => {
    it('should emit [loading, ready] state when successful', async () => {
      expect.assertions(3);

      mockTodosRepository.getTodo.mockResolvedValue({ ...firstTodo });
      instance.add(new EditTodoSubscribed('1'));

      await delay(0);
      const [loading, ready] = states;

      expect(loading?.status).toBe('loading');
      expect(ready?.status).toBe('ready');
      expect(ready?.data).toStrictEqual(firstTodo);
    });

    it('should emit [loading, failed] state when unsuccessful', async () => {
      expect.assertions(3);

      mockTodosRepository.getTodo.mockRejectedValue(new GetTodoFailure('1'));
      instance.add(new EditTodoSubscribed('1'));

      await delay(0);
      const [loading, failed] = states;

      expect(loading?.status).toBe('loading');
      expect(failed?.status).toBe('failed');
      expect(failed?.error).toBeInstanceOf(GetTodoFailure);
    });
  });

  describe('EditTodoTitleChanged', () => {
    it('should change the title', async () => {
      expect(instance.state.data.title).toBe('');
      instance.add(new EditTodoTitleChanged('test'));
      await delay(0);
      expect(instance.state.data.title).toBe('test');
    });
  });

  describe('EditTodoDescriptionChanged', () => {
    it('should change the description', async () => {
      expect(instance.state.data.description).toBe('');
      instance.add(new EditTodoDescriptionChanged('test'));
      await delay(0);
      expect(instance.state.data.description).toBe('test');
    });
  });

  describe('EditTodoSubmitted', () => {
    it('should submit a todo', async () => {
      expect(instance.state.data.id).toBeUndefined();
      expect(instance.state.data.isCompleted).toBeUndefined();
      expect(instance.state.data.description).toBe('');
      expect(instance.state.data.title).toBe('');
      expect(instance.state.submitSuccess).toBe(false);
      instance.add(new EditTodoDescriptionChanged('test description'));
      instance.add(new EditTodoTitleChanged('test'));
      instance.add(new EditTodoSubmitted());
      await delay(1000);
      expect(instance.state.data.title).toBe('test');
      expect(instance.state.data.description).toBe('test description');
      expect(instance.state.submitSuccess).toBe(true);
    });
  });
});
