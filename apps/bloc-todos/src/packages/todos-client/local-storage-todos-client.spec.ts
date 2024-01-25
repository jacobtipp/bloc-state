import { QueryClient } from '@jacobtipp/bloc-query';
import {
  LocalStorageTodosClient,
  TodoNotFoundException,
  TodosParsingFailure,
} from './local-storage-todos-client';
import { MockProxy, mock } from 'jest-mock-extended';
import { Todo } from './model/todo';
import { firstValueFrom, take } from 'rxjs';
import { BlocObserver } from '@jacobtipp/bloc';

describe('LocalStorageTodosClient', () => {
  let instance: LocalStorageTodosClient;
  let queryClient: QueryClient;
  let mockStorage: MockProxy<Storage>;

  const todos: Todo[] = [
    {
      id: '1',
      title: 'first todo',
      description: 'first todo description',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'second todo',
      description: 'second todo description',
      isCompleted: true,
    },
  ];

  const todosJsonString = JSON.stringify(todos);

  const onBeforeEach = () => {
    BlocObserver.observer = new BlocObserver();
    queryClient = new QueryClient();
    mockStorage = mock<Storage>();
  };

  const onAfterEach = () => {
    queryClient.clear();
  };

  beforeEach(() => {
    onBeforeEach();
  });

  afterEach(() => {
    jest.clearAllMocks();
    onAfterEach();
  });

  it('instance should be an instanceof LocalStorageTodosClient', () => {
    mockStorage.getItem.calledWith('todos').mockReturnValue(todosJsonString);
    instance = new LocalStorageTodosClient(queryClient, mockStorage);

    expect(instance instanceof LocalStorageTodosClient).toBeTruthy();
  });

  describe('getTodos', () => {
    it('should return an observable of todos if they exist in storage', async () => {
      expect.assertions(1);
      mockStorage.getItem.calledWith('todos').mockReturnValue(todosJsonString);
      instance = new LocalStorageTodosClient(queryClient, mockStorage);

      await expect(
        firstValueFrom(instance.getTodos().pipe(take(1)))
      ).resolves.toStrictEqual(todos);
    });

    it('should throw a TodosParseFailure error if todos JSON is corrupted', (done) => {
      expect.assertions(1);
      mockStorage.getItem.calledWith('todos').mockReturnValue('');

      instance = new LocalStorageTodosClient(queryClient, mockStorage);
      instance.getTodos().subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(TodosParsingFailure);
          done();
        },
      });
    });
  });

  describe('getTodo', () => {
    it('should get a todo if it exists', async () => {
      expect.assertions(1);
      mockStorage.getItem.calledWith('todos').mockReturnValue(todosJsonString);
      instance = new LocalStorageTodosClient(queryClient, mockStorage);
      await expect(instance.getTodo('1')).resolves.toStrictEqual(todos[0]);
    });

    it('should throw a TodoNotFoundException if it does not exist', async () => {
      expect.assertions(1);
      mockStorage.getItem.calledWith('todos').mockReturnValue(todosJsonString);
      instance = new LocalStorageTodosClient(queryClient, mockStorage);
      try {
        await instance.getTodo('3');
      } catch (e) {
        expect(e).toBeInstanceOf(TodoNotFoundException);
      }
    });
  });

  describe('saveTodo', () => {
    it('should save a todo', async () => {
      expect.assertions(1);
      mockStorage.getItem.calledWith('todos').mockReturnValue(todosJsonString);
      instance = new LocalStorageTodosClient(queryClient, mockStorage);

      const newTodo: Todo = {
        id: '3',
        isCompleted: true,
        title: 'third todo',
        description: 'third todo description',
      };

      await instance.saveTodo(newTodo);

      await expect(instance.getTodo('3')).resolves.toStrictEqual(newTodo);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      expect.assertions(2);
      mockStorage.getItem.calledWith('todos').mockReturnValue(todosJsonString);
      instance = new LocalStorageTodosClient(queryClient, mockStorage);

      await expect(instance.getTodo('2')).resolves.toBeDefined();

      await instance.deleteTodo('2');

      await expect(instance.deleteTodo('2')).rejects.toBeInstanceOf(
        TodoNotFoundException
      );
    });
  });

  describe('clearCompleted', () => {
    it('should clear all completed todos', async () => {
      expect.assertions(1);
      mockStorage.getItem.calledWith('todos').mockReturnValue(todosJsonString);
      instance = new LocalStorageTodosClient(queryClient, mockStorage);

      await expect(instance.clearCompleted()).resolves.toBe(1);
    });
  });

  describe('completeAll', () => {
    it('should set all todos as completed', async () => {
      expect.assertions(2);
      mockStorage.getItem.calledWith('todos').mockReturnValue(todosJsonString);
      instance = new LocalStorageTodosClient(queryClient, mockStorage);

      const newTodo: Todo = {
        id: '3',
        isCompleted: false,
        title: 'third todo',
        description: 'third todo description',
      };

      let todos: Todo[] = [];

      instance.getTodos().subscribe((newTodos) => {
        todos = newTodos;
      });

      await instance.saveTodo(newTodo);
      await expect(instance.completeAll(true)).resolves.toBe(2);
      expect(todos.filter((todo) => todo.isCompleted === true).length).toBe(3);
    });
  });
});
