import { BlocEvent } from '@jacobtipp/bloc';
import { Todo } from '../../../modules/todos/domain/model/todo';
import { TodosOverviewFilter } from '../model/todos-overview-filter';

export abstract class TodosOverviewEvent extends BlocEvent {}

export class TodosOverviewSubscriptionRequested extends TodosOverviewEvent {}

export class TodosOverviewTodoCompletionToggled extends TodosOverviewEvent {
  constructor(public todo: Todo, public isCompleted: boolean) {
    super();
  }
}

export class TodosOverviewTodoDeleted extends TodosOverviewEvent {
  constructor(public todo: Todo) {
    super();
  }
}

export class TodosOverviewUndoDeletionRequested extends TodosOverviewEvent {}

export class TodosOverviewFilterChanged extends TodosOverviewEvent {
  constructor(public filter: TodosOverviewFilter) {
    super();
  }
}

export class TodosOverviewToggleAllRequested extends TodosOverviewEvent {}

export class TodosOverviewClearCompletedRequested extends TodosOverviewEvent {}
