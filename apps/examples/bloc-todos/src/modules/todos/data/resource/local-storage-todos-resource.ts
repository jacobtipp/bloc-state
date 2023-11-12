import { Todo } from '../../domain';
import { BehaviorSubject } from 'rxjs';
import { TodosResource } from './todos-resource';

export class LocalStorageTodosResource
  extends BehaviorSubject<Todo[]>
  implements TodosResource
{
  constructor() {
    super([]);
    this.init();
  }

  init() {
    const todos = localStorage.getItem('todos');
    if (todos != null) {
      this.next(JSON.parse(todos));
    }
  }

  getTodo = async (id: string) => {
    const todo = this.getValue().find((todo) => todo.id === id);

    if (!todo) {
      throw new TodoNotFoundException();
    }

    return todo;
  };

  getTodos = () => this;

  saveTodo = async (todo: Todo) => {
    const todos = [...this.getValue()];
    const id = todo.id;
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex >= 0) {
      todos[todoIndex] = todo;
    } else {
      todos.push(todo);
    }
    this.next(todos);
    return localStorage.setItem('todos', JSON.stringify(todos));
  };

  deleteTodo = async (id: string) => {
    const todos = [...this.getValue()];
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new TodoNotFoundException();
    } else {
      todos.splice(todoIndex, 1);
      this.next(todos);
      return localStorage.setItem('todos', JSON.stringify(todos));
    }
  };

  async clearCompleted() {
    const todos = [...this.getValue()];
    const completedTodosAmount = todos.filter(
      (todo) => todo.isCompleted
    ).length;
    const newTodos = todos.filter((todo) => !todo.isCompleted);
    this.next(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return completedTodosAmount;
  }

  async completeAll(isCompleted: boolean) {
    const todos = [...this.getValue()];
    const changedTodosAmount = todos.filter(
      (todo) => todo.isCompleted !== isCompleted
    ).length;
    const newTodos = todos.map((todo) => ({ ...todo, isCompleted }));
    this.next(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return changedTodosAmount;
  }
}

export class TodoNotFoundException extends Error {}

export const todosResource = new LocalStorageTodosResource();
