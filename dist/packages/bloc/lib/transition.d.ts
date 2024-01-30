/**
 * Represents a transition between two states caused by an event of a given type.
 *
 * @template Event The type of the event that caused the transition.
 * @template State The type of the states being transitioned.
 */
export declare class Transition<Event, State> {
    currentState: State;
    event: Event;
    nextState: State;
    /**
     * Creates a new instance of the `Transition` class.
     *
     * @param currentState The current state.
     * @param event The event that caused the transition.
     * @param nextState The next state.
     */
    constructor(currentState: State, event: Event, nextState: State);
}
