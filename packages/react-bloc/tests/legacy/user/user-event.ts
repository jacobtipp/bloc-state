export abstract class UserEvent {
  protected _!: void;
}

export class UserLastNameChangedEvent extends UserEvent {}

export class UserNameChangedEvent extends UserEvent {
  constructor(public userName: { first: string; last: string }) {
    super();
  }
}

export class UserLastNameAsyncChangedEvent extends UserEvent {
  constructor(public userName: string) {
    super();
  }
}

export class UserAgeChangedEvent extends UserEvent {
  constructor(public age: number) {
    super();
  }
}

export class UserErrorEvent extends UserEvent {}

export class UserSuspenseEvent extends UserEvent {}
