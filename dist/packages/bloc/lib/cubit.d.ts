import { BlocBase } from './base';
/**
 * A base abstract class representing a Cubit.
 * A Cubit is responsible for managing the state of the application
 * and notifying its listeners when the state changes.
 *
 * @template State The type of the state managed by this Cubit.
 */
export declare abstract class Cubit<State> extends BlocBase<State> {
    /**
     * Creates an instance of Cubit.
     *
     * @param {State} state - The initial state of the Cubit.
     */
    constructor(state: State, name?: string);
}
