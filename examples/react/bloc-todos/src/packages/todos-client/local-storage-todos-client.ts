import { BehaviorSubject } from 'rxjs';
import { TodosClient } from './todos-client';
import { Todo } from './model/todo';

export class LocalStorageTodosClient implements TodosClient {
  private todos$ = new BehaviorSubject<Todo[]>([]);

  constructor() {
    this.init();
  }

  init() {
    const todos = localStorage.getItem('todos');
    if (todos != null) {
      this.todos$.next(JSON.parse(todos));
    }
  }

  getTodo = async (id: string) => {
    const todo = this.todos$.getValue().find((todo) => todo.id === id);

    if (!todo) {
      throw new TodoNotFoundException();
    }

    return todo;
  };

  getTodos = () => this.todos$;

  saveTodo = async (todo: Todo) => {
    const todos = [...this.todos$.getValue()];
    const id = todo.id;
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex >= 0) {
      todos[todoIndex] = todo;
    } else {
      todos.push(todo);
    }
    this.todos$.next(todos);
    return localStorage.setItem('todos', JSON.stringify(todos));
  };

  deleteTodo = async (id: string) => {
    const todos = [...this.todos$.getValue()];
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new TodoNotFoundException();
    } else {
      todos.splice(todoIndex, 1);
      this.todos$.next(todos);
      return localStorage.setItem('todos', JSON.stringify(todos));
    }
  };

  async clearCompleted() {
    const todos = [...this.todos$.getValue()];
    const completedTodosAmount = todos.filter(
      (todo) => todo.isCompleted
    ).length;
    const newTodos = todos.filter((todo) => !todo.isCompleted);
    this.todos$.next(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return completedTodosAmount;
  }

  async completeAll(isCompleted: boolean) {
    const todos = [...this.todos$.getValue()];
    const changedTodosAmount = todos.filter(
      (todo) => todo.isCompleted !== isCompleted
    ).length;
    const newTodos = todos.map((todo) => ({ ...todo, isCompleted }));
    this.todos$.next(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return changedTodosAmount;
  }
}

export class TodoNotFoundException extends Error {}
