export abstract class EditTodoEvent {
  protected _!: void;
}

export class EditTodoTitleChanged extends EditTodoEvent {
  constructor(public title: string) {
    super();
  }
}

export class EditTodoDescriptionChanged extends EditTodoEvent {
  constructor(public description: string) {
    super();
  }
}

export class EditTodoSubscribed extends EditTodoEvent {
  constructor(public todoId: string) {
    super();
  }
}

export class EditTodoSubmitted extends EditTodoEvent {}
