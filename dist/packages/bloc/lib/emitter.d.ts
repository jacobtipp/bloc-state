import { Observable } from 'rxjs';
/**
 * A generic interface representing an object that can be used to emit and listen to changes in a BLoC instance's state.
 *
 * @template State - The type of the state that can be emitted.
 */
export interface BlocEmitter<State> {
    /** Cancels all subscriptions registered with this emitter. */
    close(): void;
    isClosed: boolean;
    /** Emits the provided state. */
    call(state: State): void;
    /**
     * Registers listeners for events on a provided `Observable<T>` stream.
     *
     * @param stream$ - The stream to listen to.
     * @param onData - The function to execute when new data is emitted.
     * @param onError - The function to execute if an error is encountered.
     *
     * @returns A promise that resolves when the subscription completes or rejects if there was an error.
     */
    onEach<T>(stream$: Observable<T>, onData: (data: T) => void, onError?: (error: Error) => void): Promise<void>;
    /**
     * Registers listeners for events on a provided `Observable<T>` stream and maps emitted data to new states to emit.
     *
     * @param stream$ - The stream to listen to.
     * @param onData - The function to execute when new data is emitted, that maps the emitted data to a new state to emit.
     * @param onError - The function to execute if an error is encountered, that maps the error to a new state to emit.
     *
     * @returns A promise that resolves when the subscription completes or rejects if there was an error.
     */
    forEach<T>(stream$: Observable<T>, onData: (data: T) => State, onError?: (error: Error) => State): Promise<void>;
}
/**
 * Defines a function that can be used to emit state changes.
 *
 * @template State - The type of the state that is emitted.
 */
export interface Emitter<State> extends Omit<BlocEmitter<State>, 'close'> {
    /** Emits the provided state. */
    (state: State): void;
}
/**
 * An implementation of `BlocEmitter` that allows for emiting and listening to changes in a BLoC instance's state.
 *
 * @template State - The type of the state that can be emitted.
 */
export declare class EmitterImpl<State> implements Omit<BlocEmitter<State>, 'isClosed'> {
    private _emit;
    /**
     * Initializes a new instance of `_Emitter`.
     *
     * @param _emit - The function to use when emitting new states.
     */
    constructor(_emit: (newState: State) => void);
    /** A list of subscriptions that have been registered with this emitter. */
    private _disposables;
    /**
     * Emits the provided state.
     *
     * @param state - The new state to emit.
     */
    call(state: State): void;
    /**
     * Registers listeners for events on a provided `Observable<T>` stream.
     *
     * @param stream$ - The stream to listen to.
     * @param onData - The function to execute when new data is emitted.
     * @param onError - The function to execute if an error is encountered.
     *
     * @returns A promise that resolves when the subscription completes or rejects if there was an error.
     */
    onEach<T>(stream$: Observable<T>, onData: (data: T) => void, onError?: (error: Error) => void): Promise<void>;
    /**
     * Registers listeners for events on a provided `Observable<T>` stream and maps emitted data to new states to emit.
     *
     * @param stream$ - The stream to listen to.
     * @param onData - The function to execute when new data is emitted, that maps the emitted data to a new state to emit.
     * @param onError - The function to execute if an error is encountered, that maps the error to a new state to emit.
     *
     * @returns A promise that resolves when the subscription completes or rejects if there was an error.
     */
    forEach<T>(stream$: Observable<T>, onData: (data: T) => State, onError?: ((error: Error) => State) | undefined): Promise<void>;
    /** Cancels all subscriptions registered with this emitter. */
    close(): void;
}
