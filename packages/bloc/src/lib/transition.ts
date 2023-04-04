/**
 * Represents a transition between two states caused by an event of a given type.
 *
 * @template Event The type of the event that caused the transition.
 * @template State The type of the states being transitioned.
 */
export class Transition<Event, State> {
  /**
   * Creates a new instance of the `Transition` class.
   *
   * @param currentState The current state.
   * @param event The event that caused the transition.
   * @param nextState The next state.
   */
  constructor(
    public currentState: State,
    public event: Event,
    public nextState: State
  ) {}
}
