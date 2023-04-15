import { BlocEvent, Bloc } from '@jacobtipp/bloc';
import { State } from '@jacobtipp/state';

import { delay } from '../counter/delay';

export interface User {
  name: {
    first: string;
    last: string;
  };
  age: number;
}

export class UserState extends State<User> {
  constructor() {
    super({ name: { first: '', last: '' }, age: 0 });
  }
}

export class UserEvent extends BlocEvent {}

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

export class UserBloc extends Bloc<UserEvent, UserState> {
  constructor() {
    super(new UserState());

    this.on(UserLastNameChangedEvent, async (_event, emit) => {
      await delay(300);
      emit(
        this.state.ready((user) => {
          user.name.last = 'parker';
        })
      );
    });

    this.on(UserLastNameAsyncChangedEvent, async (event, emit) => {
      emit(this.state.loading());
      await delay(1000);
      emit(
        this.state.ready((user) => {
          user.name.last = event.userName;
        })
      );
    });

    this.on(UserNameChangedEvent, (event, emit) =>
      emit(
        this.state.ready((user) => {
          user.name.first = event.userName.first;
        })
      )
    );

    this.on(UserAgeChangedEvent, (_event, emit) =>
      emit(
        this.state.ready((user) => {
          user.age = this.state.data.age + 1;
        })
      )
    );
  }
}
