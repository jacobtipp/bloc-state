import { MockProxy, mock } from 'jest-mock-extended';
import { Observable, of } from 'rxjs';
import {
  DeleteTodoFailure,
  GetTodoFailure,
  GetTodosFailure,
  TodosRepository,
} from './todos-repository';
import { TodosClient } from '../todos-client/todos-client';
import { Todo } from '../todos-client/model/todo';
import {
  TodoNotFoundException,
  TodosParsingFailure,
} from '../todos-client/local-storage-todos-client';

describe('TodosRepository', () => {
  let mockTodosClient: MockProxy<TodosClient>;
  let instance: TodosRepository;

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
    mockTodosClient = mock<TodosClient>();
    mockTodosClient.getTodos.mockReturnValue(of(todos));
    instance = new TodosRepository(mockTodosClient);
  });

  it('instance should be an instanceof TodosRepository', () => {
    expect.assertions(1);
    expect(instance instanceof TodosRepository).toBeTruthy();
  });

  describe('getTodo', () => {
    it('should return a single todo', async () => {
      expect.assertions(1);
      mockTodosClient.getTodo.mockResolvedValue(firstTodo);
      await expect(instance.getTodo('1')).resolves.toStrictEqual(firstTodo);
    });

    it('should throw GetTodoFailure if todo is not found', async () => {
      expect.assertions(1);
      mockTodosClient.getTodo.mockRejectedValue(new TodoNotFoundException('1'));
      await expect(instance.getTodo('1')).rejects.toBeInstanceOf(
        GetTodoFailure
      );
    });
  });

  describe('getTodos', () => {
    it('should return an observable of an array of todos', (done) => {
      expect.assertions(2);
      const todos$ = instance.getTodos();
      expect(todos$).toBeInstanceOf(Observable);

      todos$.subscribe({
        next: (_todos) => expect(_todos).toStrictEqual(todos),
        complete: () => {
          done();
        },
      });
    });

    it('should throw a GetTodosFailure when failure', (done) => {
      expect.assertions(2);
      const failure = new Observable<Todo[]>((observer) => {
        observer.error(new TodosParsingFailure());
      });

      mockTodosClient.getTodos.mockReturnValue(failure);

      const todos$ = instance.getTodos();
      expect(todos$).toBeInstanceOf(Observable);

      todos$.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(GetTodosFailure);
          done();
        },
      });
    });
  });

  describe('saveTodo', () => {
    it('should save a single todo', async () => {
      expect.assertions(1);
      await instance.saveTodo(firstTodo);
      expect(mockTodosClient.saveTodo).toBeCalled();
    });
  });

  describe('deleteTodo', () => {
    it('should delete a single todo', async () => {
      expect.assertions(1);
      await instance.deleteTodo('1');
      expect(mockTodosClient.deleteTodo).toBeCalled();
    });

    it('should throw DeleteTodoFailure if todo does not exist', async () => {
      expect.assertions(1);
      mockTodosClient.deleteTodo.mockRejectedValue(
        new TodoNotFoundException('1')
      );
      await expect(instance.deleteTodo('1')).rejects.toBeInstanceOf(
        DeleteTodoFailure
      );
    });
  });

  describe('completeAll', () => {
    it('should complete all Todos', async () => {
      expect.assertions(1);
      await instance.completeAll(true);
      expect(mockTodosClient.completeAll).toBeCalled();
    });
  });

  describe('clearCompleted', () => {
    it('should clear completed todos', async () => {
      expect.assertions(1);
      await instance.clearCompleted();
      expect(mockTodosClient.clearCompleted).toBeCalled();
    });
  });
});
