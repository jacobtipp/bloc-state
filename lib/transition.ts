import { BlocEvent, BlocState } from ".";

export class Transition<Event extends BlocEvent, State extends BlocState> {
  constructor(public currentState: State, public event: Event, public nextState: State) {}
}
