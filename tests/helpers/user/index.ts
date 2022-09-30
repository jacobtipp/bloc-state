import { Transition } from "../../../lib";
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

export abstract class UserState<T = any> extends BlocState<T> {}

export class UserNameChangeState extends UserState<User> {}

export class UserAgeChangedState extends UserState<User> {}

export class RandomDerivedUserState extends UserState<{ payload: string }> {}

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

export class TriggerRandomDerivedEvent extends UserEvent {
  constructor(public payload?: string) {
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

  randomUserState$ = this.filterType(RandomDerivedUserState);

  ageGreaterThanZero$ = this.filter(({ payload }) => payload.hasData && payload.data.age > 0);

  ageGreaterThanZeroWithType$ = this.filter(
    ({ payload }) => payload.hasData && payload.data.age > 0,
    UserAgeChangedState
  );

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

    this.on(TriggerRandomDerivedEvent, ({ payload }, emit) => {
      if (payload != null) {
        emit(RandomDerivedUserState.ready({ payload }));
      } else {
        emit(RandomDerivedUserState.ready());
      }
    });

    this.on(UserNameChangedEvent, (event, emit) => {
      emit((current) => {
        const data = current.payload.data;
        return UserNameChangeState.ready({ ...data, name: event.name });
      });
    });

    this.on(UserAgeChangedEvent, (event, emit) => {
      emit((current) => {
        const data = current.payload.data;
        return UserAgeChangedState.ready({ ...data, age: event.age });
      });
    });
  }

  protected override onError(error: Error): void {
    //console.log(error)
  }

  protected override onEvent(event: UserEvent): void {
    //console.log(event)
  }

  protected override onTransition(transition: Transition<UserEvent, UserState<any>>): void {}
}
