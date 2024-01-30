import { Observable, Subscription, Observer } from 'rxjs';
import { Change } from './change';
export type NextFunction<State> = (value: State) => void;
/**
 * Base class for implementing BLoC pattern.
 *
 * @typeParam State - The type of the state maintained by the BLoC.
 */
export declare abstract class BlocBase<State = unknown> {
    /**
     * Initializes a new instance of the `BlocBase` class.
     *
     * @param state - The initial state of the BLoC.
     */
    constructor(state: State, name?: string);
    /**
     * The name of the BLoC instance.
     */
    readonly name: string;
    /**
     * A read-only observable stream of the state maintained by the BLoC.
     */
    readonly state$: Observable<State>;
    /** A set of stream subscriptions that a bloc has subscribed to. */
    protected readonly subscriptions: Set<Subscription>;
    /**
     * Whether or not the BLoC instance has been closed.
     */
    protected _isClosed: boolean;
    /**
     * Whether or not the current state has been emitted.
     */
    protected _emitted: boolean;
    /**
     * The current state of the BLoC.
     */
    private _state;
    /**
     * The subject that publishes changes in the state of the BLoC.
     */
    private readonly _stateSubject$;
    /**
     * Returns the current state of the BLoC.
     *
     * @returns The current state of the BLoC.
     */
    get state(): State;
    /**
     * Returns whether or not the BLoC instance has been closed.
     *
     * @returns Whether or not the BLoC instance has been closed.
     */
    get isClosed(): boolean;
    /**
     * Executes when the BLoC encounters an error.
     *
     * @param error - The error encountered by the BLoC.
     */
    protected onError(error: Error): void;
    /**
     * Executes when the state of the BLoC changes.
     *
     * @param change - Information about the change in state of the BLoC.
     */
    protected onChange(change: Change<State>): void;
    /**
     * Executes when the BLoC instance is closed.
     */
    protected onClose(): void;
    /**
     * Reports an error which triggers onError
     *
     * @param error - An error that has been thrown within a Bloc's execution
     */
    protected addError(error: Error): void;
    /**
     * Listens to an observable and manages the subscription internally.
     *
     * @param {Observable<State>} observable - The observable to subscribe to.
     * @param {Partial<Observer<State>> | NextFunction<State>} observerOrNext -
     * An observer object or a function to be used as the next callback.
     * @returns {{ unsubscribe: () => void, isClosed: boolean }} An object with an unsubscribe method
     * to stop the subscription and a boolean indicating whether the subscription is closed.
     *
     * @template State - The type of the state maintained by the observable.
     */
    protected listenTo(observable: Observable<State>, observerOrNext: Partial<Observer<State>> | NextFunction<State>): {
        unsubscribe: () => void;
        isClosed: boolean;
    };
    /**
     * Emits new BLoC state, this should only be used internally by other libraries or for testing.
     */
    __unsafeEmit__(newState: State): void;
    /**
     * Emits a new state for the BLoC.
     *
     * @param newState - The new state of the BLoC.
     */
    protected emit(newState: State): void;
    fromJson(json: string): State;
    toJson(state: State): string;
    /**
     * Closes the BLoC instance.
     */
    close(): void;
}
