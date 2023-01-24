export class Change<State> {
  constructor(public currentState: State, public nextState: State) {}
}
