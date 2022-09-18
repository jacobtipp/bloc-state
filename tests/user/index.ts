import { Bloc } from "../../lib/bloc";
import { BlocEvent } from "../../lib/event";
import { BlocState } from "../../lib/state";

export interface User {
  name: {
    first: string;
    last: string;
  };
  age: number;
}

export class UserState extends BlocState<User> {}

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

  age$ = this.select((state) => state.age);

  bob$ = this.select(
    (state) => state.name, // map all names
    (state) => state.first === "bob" // filter all names with firstName "bob"
  );

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
      emit((current) => {
        if (current.payload.hasData) {
          const data = current.payload.data;
          return UserState.ready({ ...data, name: event.name });
        }
      });
    });

    this.on(UserAgeChangedEvent, (event, emit) => {
      emit((current) => {
        if (current.payload.hasData) {
          const data = current.payload.data;
          return UserState.ready({ ...data, age: data.age + 1 });
        }
      });
    });
  }
}
