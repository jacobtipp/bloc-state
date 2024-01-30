import { Bloc, Emitter } from '@jacobtipp/bloc';

import {
  TodosOverviewClearCompletedRequested,
  TodosOverviewEvent,
  TodosOverviewFilterChanged,
  TodosOverviewSubscriptionRequested,
  TodosOverviewTodoCompletionToggled,
  TodosOverviewTodoDeleted,
  TodosOverviewToggleAllRequested,
  TodosOverviewUndoDeletionRequested,
} from './todos-overview.event';
import { TodosOverviewState } from './todos-overview.state';
import { WithHydratedBloc } from '@jacobtipp/hydrated-bloc';
import { TodosRepository } from '../../../packages/todos-repository/todos-repository';

export class TodosOverviewBlocBase extends Bloc<
  TodosOverviewEvent,
  TodosOverviewState
> {
  constructor(private readonly todosRepository: TodosRepository) {
    super(
      new TodosOverviewState({
        todos: [],
        filter: 'all',
      })
    );

    this.on(TodosOverviewSubscriptionRequested, this.onSubscriptionRequested);
    this.on(TodosOverviewTodoCompletionToggled, this.onTodoCompletionToggled);
    this.on(TodosOverviewFilterChanged, this.onFilterChanged);
    this.on(TodosOverviewToggleAllRequested, this.onToggleAllRequested);
    this.on(TodosOverviewTodoDeleted, this.onTodoDeleted);
    this.on(TodosOverviewUndoDeletionRequested, this.onUndoDeletionRequsted);
    this.on(
      TodosOverviewClearCompletedRequested,
      this.onClearCompletedRequested
    );
  }

  private async onUndoDeletionRequsted(
    _event: TodosOverviewUndoDeletionRequested,
    emit: Emitter<TodosOverviewState>
  ) {
    const todo = this.state.data.lastDeletedTodo;

    if (!todo) {
      return;
    }

    await this.todosRepository.saveTodo(todo);
    emit(
      this.state.ready((data) => {
        data.lastDeletedTodo = undefined;
      })
    );
  }

  private async onTodoDeleted(
    event: TodosOverviewTodoDeleted,
    emit: Emitter<TodosOverviewState>
  ) {
    await this.todosRepository.deleteTodo(event.todo.id);
    emit(
      this.state.ready((data) => {
        data.lastDeletedTodo = event.todo;
      })
    );
  }

  private async onClearCompletedRequested(
    _event: TodosOverviewClearCompletedRequested,
    _emit: Emitter<TodosOverviewState>
  ) {
    await this.todosRepository.clearCompleted();
  }

  private async onToggleAllRequested(
    _event: TodosOverviewToggleAllRequested,
    _emit: Emitter<TodosOverviewState>
  ): Promise<void> {
    const areAllCompleted = this.state.data.todos.every(
      (todo) => todo.isCompleted
    );
    await this.todosRepository.completeAll(!areAllCompleted);
  }

  private onFilterChanged(
    event: TodosOverviewFilterChanged,
    emit: Emitter<TodosOverviewState>
  ) {
    emit(
      this.state.ready((data) => {
        data.filter = event.filter;
      })
    );
  }

  private async onSubscriptionRequested(
    _event: TodosOverviewSubscriptionRequested,
    emit: Emitter<TodosOverviewState>
  ) {
    emit(this.state.loading());

    await emit.forEach(
      this.todosRepository.getTodos(),
      (todos) => {
        return this.state.ready((data) => {
          data.todos = todos;
        });
      },
      (error: Error) => {
        this.addError(error);
        return this.state.failed(error);
      }
    );
  }

  private async onTodoCompletionToggled(
    event: TodosOverviewTodoCompletionToggled,
    _emit: Emitter<TodosOverviewState>
  ) {
    const todo = { ...event.todo, isCompleted: event.isCompleted };
    await this.todosRepository.saveTodo(todo);
  }

  override fromJson(json: string): TodosOverviewState {
    const parsed = super.fromJson(json);
    return new TodosOverviewState(parsed.data, parsed.status);
  }
}

export class TodosOverviewBloc extends WithHydratedBloc(TodosOverviewBlocBase) {
  constructor(todosRepo: TodosRepository) {
    super(todosRepo);
    this.hydrate();
  }
}
