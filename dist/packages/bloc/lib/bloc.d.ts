import { Observable, Subject } from 'rxjs';
import { BlocBase } from './base';
import { Emitter } from './emitter';
import { Transition } from './transition';
import { AbstractClassType, ClassType } from './types';
/**
 * EventHandler that takes an event and emits state changes.
 *
 * @template E - The generic type of the event.
 * @template S - The generic type of the state.
 */
export type EventHandler<E, S> = (event: InstanceType<ClassType<E>>, emitter: Emitter<S>) => void | Promise<void>;
/**
 * A function that maps an event to an observable sequence of events.
 *
 * @template Event - The generic type of the event sequence being transformed.
 */
export type EventMapper<Event> = (event: Event) => Observable<Event>;
/**
 * A function that takes an observable sequence of events and a mapper and returns the transformed observable sequence of events.
 *
 * @template Event - The generic type of the event sequence being transformed.
 */
export type EventTransformer<Event> = (events$: Observable<Event>, mapper: EventMapper<Event>) => Observable<Event>;
interface BlocOptions<Event> {
    name?: string;
    transformer?: EventTransformer<Event>;
}
/**
 * An abstract class representing a BLoC.
 *
 * @template Event - The generic type of the event.
 * @template State - The generic type of the state.
 */
export declare abstract class Bloc<Event, State> extends BlocBase<State> {
    /**
     * Creates a new instance of the Bloc class.
     *
     * @param state - The initial state of the BLoC.
     */
    constructor(state: State, options?: BlocOptions<Event>);
    /** An observable stream of BLoC events. */
    protected readonly _eventSubject$: Subject<Event>;
    /** A mapping of registered events to their corresponding handler. */
    private readonly _eventMap;
    /** A collection of stateMappers with their respective filters for each registerered handler. */
    private readonly _eventStateMappers;
    /** An event transformer to be applied to stream of all BloC events. */
    private readonly _globalTransformer?;
    /** A set of emitters for the state. */
    private readonly _emitters;
    /** Indicates whether this is an instance of Bloc. */
    readonly isBlocInstance = true;
    /** This should only be used by devtools as signal to prevent BlocListeners from performing side-effects during time travel */
    static ignoreListeners: boolean;
    /**
     * Returns an event transformer.
     *
     * @template T - The generic type of the input and output event sequence.
     */
    static transformer<T>(): EventTransformer<T>;
    /**
     * Handles errors that occur during the BLoC's lifecycle.
     *
     * @param error - The error that occurred.
     */
    protected onError(error: Error): void;
    /**
     * Handles transitions between BLoC states.
     *
     * @param transition - The transition that occurred.
     */
    protected onTransition(transition: Transition<Event, State>): void;
    /**
     * Handles BLoC events.
     *
     * @param event - The event that occurred.
     */
    protected onEvent(event: Event): void;
    /**
     * Registers an event handler for a given event.
     *
     * @param event - The event to register the handler for.
     * @param eventHandler - The handler function.
     * @param transformer - An optional event transformer to use. If none is provided, a default transformer will be used.
     *
     * @throws if there is already an event handler registered for the given event.
     */
    protected on<T extends Event>(event: ClassType<T> | AbstractClassType<T>, eventHandler: EventHandler<T, State>, transformer?: EventTransformer<T>): void;
    private hasAncestor;
    /**
     * Adds an event to the BLoC's stream of events.
     *
     * @param event - The event to add.
     *
     * @throws if there is no registered event handler for the given event.
     *
     * @returns The instance of the Bloc.
     */
    add(event: Event): this;
    /** Closes all the emitters */
    close(): void;
}
/**
 * Type guard for Bloc objects.
 *
 * @param bloc - The object to check if it's a Bloc.
 *
 * @returns True if the object is a Bloc or has an isBlocInstance property, false otherwise.
 */
export declare const isBlocInstance: (bloc: any) => bloc is Bloc<any, any>;
export {};
