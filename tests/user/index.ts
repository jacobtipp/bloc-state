import { Bloc } from "../../lib/bloc";
import { BlocEvent } from "../../lib/event";
import { BlocState } from "../../lib/state";
import {} from "../../lib/types";

export interface User {
  name: {
    first: string;
    last: string;
  };
  age: number;
}

export class UserState<T = any> extends BlocState<T> {}

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
  constructor() {
    super(
      UserState.init({
        name: {
          first: "",
          last: "",
        },
        age: 0,
      })
    );

    this.on(UserNameChangedEvent, (event, emit) => {
      emit((previousState) => {
        if (previousState.payload.hasData) {
          const data = previousState.payload.data;
          return UserState.ready({ ...data, name: event.name });
        }
      });
    });

    this.on(UserAgeChangedEvent, (event, emit) => {
      emit((previousState) => {
        if (previousState.payload.hasData) {
          const data = previousState.payload.data;
          return UserState.ready({ ...data, age: data.age + 1 });
        }
      });
    });
  }

  protected override onError(error: Error): void {
    console.log(error);
  }

  name$ = this.select((data) => data.name);

  age$ = this.select((data) => data.age);
}
