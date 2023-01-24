import { State } from "@bloc-state/state"
import { Bloc } from "../../../src"
import { BlocEvent } from "../../../src"

export type User = {
  name: {
    first: string
    last: string
  }
  age: number
}

export class UserState extends State<User> {
  constructor() {
    super({
      name: {
        first: "",
        last: "",
      },
      age: 0,
    })
  }
}

export abstract class UserEvent extends BlocEvent {}

export class UserNameChangedEvent extends UserEvent {
  constructor(public name: { first: string; last: string }) {
    super()
  }
}

export class UserAgeChangedEvent extends UserEvent {
  constructor(public age: number) {
    super()
  }
}

export class UserBloc extends Bloc<UserEvent, UserState> {
  constructor() {
    super(new UserState())

    this.on(UserNameChangedEvent, (event, emit) => {
      emit((state) =>
        state.ready((data) => {
          data.name = event.name
        }),
      )
    })

    this.on(UserAgeChangedEvent, (event, emit) => {
      emit((state) =>
        state.ready((data) => {
          data.age = event.age
        }),
      )
    })
  }
}
