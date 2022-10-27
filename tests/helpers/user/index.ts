import { StatePayload, Transition } from "../../../lib";
import { Bloc } from "../../../lib/bloc";
import { BlocEvent } from "../../../lib/event";
import { BlocState } from "../../../lib/state";

export interface User {
  name: {
    first: string;
    last: string;
  };
  age: number;
}

export abstract class UserState extends BlocState<User> {}

export class UserNameChangeState extends UserState {}

export class UserAgeChangedState extends UserState {}

export class UserEvent extends BlocEvent {}

export class UserNameChangedEvent extends UserEvent {
  constructor(public name: { first: string; last: string }) {
    super();
  }
}

export class UserAgeChangedEvent extends UserEvent {
  constructor(public age: number) {
    super();
  }
}

export class UserBloc extends Bloc<UserEvent, UserState> {
  name$ = this.select((state) => state.name);

  ageWithSelectorMethod$ = this.select((state) => state.age);

  age$ = this.select({
    selector: (state) => state.age as number,
  });

  bob$ = this.select({
    selector: (state) => state.name.first,
    filter: (name) => name === "bob",
  });

  firstName$ = this.select({
    selector: (state) => state.name.first,
  });

  constructor() {
    super(
      UserNameChangeState.init({
        name: {
          first: "",
          last: "",
        },
        age: 0,
      })
    );

    this.on(UserNameChangedEvent, UserNameChangeState, (event, emit) => {
      emit(UserNameChangeState.ready({ ...this.data, name: event.name }));
    });

    this.on(UserAgeChangedEvent, UserAgeChangedState, (event, emit) => {
      emit(UserAgeChangedState.ready({ ...this.data, age: event.age }));
    });
  }
}
