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
  name$ = this.select((state) => state.name, UserNameChangeState);

  ageWithBlocState$ = this.select((state) => state.age, UserAgeChangedState);

  age$ = this.select({
    selector: (state) => state.age as number,
    filter: (state) => state != null,
  });

  ageGreaterThanZero$ = this.filter(({ age }) => age > 0);

  ageGreaterThanZeroWithType$ = this.filter(({ age }) => age > 0, UserAgeChangedState);

  bob$ = this.select(
    {
      selector: (state) => state.name.first,
      filter: (name) => name === "bob",
    },
    UserNameChangeState
  );

  firstName$ = this.select(
    {
      selector: (state) => state.name.first,
    },
    UserNameChangeState
  );

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

    this.on(UserNameChangedEvent, (event, emit) => {
      emit((current) => {
        return UserNameChangeState.ready({ ...current, name: event.name });
      });
    });

    this.on(UserAgeChangedEvent, (event, emit) => {
      emit((current) => {
        return UserAgeChangedState.ready({ ...current, age: event.age });
      });
    });
  }
}
