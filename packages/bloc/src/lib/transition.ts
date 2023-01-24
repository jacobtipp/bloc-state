import { BlocEvent } from "."

export class Transition<Event extends BlocEvent, State> {
  constructor(
    public currentState: State,
    public event: Event,
    public nextState: State,
  ) {}
}
