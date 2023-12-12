import { BehaviorSubject } from 'rxjs';
import { TodosClient } from './todos-client';
import { Todo } from './model/todo';

export class LocalStorageTodosClient implements TodosClient {
  private _todos$ = new BehaviorSubject<Todo[]>([]);

  constructor() {
    this.init();
  }

  init() {
    const todos = localStorage.getItem('todos');
    if (todos != null) {
      this._todos$.next(JSON.parse(todos));
    }
  }

  getTodo = async (id: string) => {
    const todo = this._todos$.getValue().find((todo) => todo.id === id);

    if (!todo) {
      throw new TodoNotFoundException();
    }

    return todo;
  };

  getTodos = () => this._todos$.asObservable();

  saveTodo = async (todo: Todo) => {
    const todos = [...this._todos$.getValue()];
    const id = todo.id;
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex >= 0) {
      todos[todoIndex] = todo;
    } else {
      todos.push(todo);
    }
    this._todos$.next(todos);
    return localStorage.setItem('todos', JSON.stringify(todos));
  };

  deleteTodo = async (id: string) => {
    const todos = [...this._todos$.getValue()];
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new TodoNotFoundException();
    } else {
      todos.splice(todoIndex, 1);
      this._todos$.next(todos);
      return localStorage.setItem('todos', JSON.stringify(todos));
    }
  };

  async clearCompleted() {
    const todos = [...this._todos$.getValue()];
    const completedTodosAmount = todos.filter(
      (todo) => todo.isCompleted
    ).length;
    const newTodos = todos.filter((todo) => !todo.isCompleted);
    this._todos$.next(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return completedTodosAmount;
  }

  async completeAll(isCompleted: boolean) {
    const todos = [...this._todos$.getValue()];
    const changedTodosAmount = todos.filter(
      (todo) => todo.isCompleted !== isCompleted
    ).length;
    const newTodos = todos.map((todo) => ({ ...todo, isCompleted }));
    this._todos$.next(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return changedTodosAmount;
  }
}

export class TodoNotFoundException extends Error {}
