import { filter, mergeMap, Observable, Subject, Subscription } from 'rxjs';

import { BlocBase } from './base';
import { BlocObserver } from './bloc-observer';
import { Emitter, _Emitter } from './emitter';
import { StateError } from './errors';
import { BlocEvent } from './event';
import { Transition } from './transition';
import { ClassType } from './types';

/**
 * EventHandler that takes an event and emits state changes.
 *
 * @template E - The generic type of the BlocEvent.
 * @template S - The generic type of the state.
 */
export type EventHandler<E extends BlocEvent, S> = (
  event: InstanceType<ClassType<E>>,
  emitter: Emitter<S>
) => void | Promise<void>;

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
export type EventTransformer<Event> = (
  events$: Observable<Event>,
  mapper: EventMapper<Event>
) => Observable<Event>;

/**
 * An abstract class representing a BLoC.
 *
 * @template Event - The generic type of the BlocEvent.
 * @template State - The generic type of the state.
 */
export abstract class Bloc<
  Event extends BlocEvent,
  State
> extends BlocBase<State> {
  /**
   * Creates a new instance of the Bloc class.
   *
   * @param state - The initial state of the BLoC.
   */
  constructor(state: State) {
    super(state);
    this.on = this.on.bind(this);
    this.add = this.add.bind(this);
    this.emit = this.emit.bind(this);
  }

  /** An observable stream of BLoC events. */
  private readonly _eventSubject$ = new Subject<Event>();

  /** A mapping of registered events to their corresponding handler. */
  private readonly _eventMap = new WeakMap<ClassType<Event>, 1>();

  /** A set of subscriptions to the observable stream of events. */
  private readonly _subscriptions = new Set<Subscription>();

  /** A set of emitters for the state. */
  private readonly _emitters = new Set<Emitter<State>>();

  /** Indicates whether this is an instance of Bloc. */
  readonly isBlocInstance = true;

  /**
   * Returns an event transformer.
   *
   * @template T - The generic type of the input and output event sequence.
   */
  static transformer<T>(): EventTransformer<T> {
    return (events$, mapper) => events$.pipe(mergeMap(mapper));
  }

  /**
   * Handles errors that occur during the BLoC's lifecycle.
   *
   * @param error - The error that occurred.
   */
  protected override onError(error: Error): void {
    Bloc.observer.onError(this, error);
  }

  /**
   * Handles transitions between BLoC states.
   *
   * @param transition - The transition that occurred.
   */
  protected onTransition(transition: Transition<Event, State>): void {
    Bloc.observer.onTransition(this, transition);
  }

  /**
   * Handles BLoC events.
   *
   * @param event - The event that occurred.
   */
  protected onEvent(event: Event): void {
    Bloc.observer.onEvent(this, event);
  }

  /**
   * Registers an event handler for a given event.
   *
   * @param event - The event to register the handler for.
   * @param eventHandler - The handler function.
   * @param transformer - An optional event transformer to use. If none is provided, a default transformer will be used.
   *
   * @throws if there is already an event handler registered for the given event.
   */
  protected on<T extends Event>(
    event: ClassType<T>,
    eventHandler: EventHandler<T, State>,
    transformer?: EventTransformer<T>
  ): void {
    if (this._eventMap.has(event)) {
      throw new Error(`${event.name} can only have one EventHandler`);
    }

    this._eventMap.set(event, 1);

    const mapEventToState = (event: T): Observable<T> => {
      const stateToBeEmittedStream$ = new Subject<State>();
      let isClosed = false;

      const onEmit = (nextState: State): void => {
        if (isClosed) {
          return;
        }

        if (this.state === nextState && this._emitted) return;

        try {
          this.onTransition(new Transition(this.state, event, nextState));
          stateToBeEmittedStream$.next(nextState);
        } catch (error) {
          this.onError(error as Error);
        }
      };

      const _emitter = new _Emitter(onEmit.bind(this));

      const _callableEmitter = (state: State) => _emitter.call(state);

      _callableEmitter.close = () => {
        isClosed = true;
        _emitter.close();
      };

      _callableEmitter.onEach = <T>(
        stream$: Observable<T>,
        onData: (data: T) => void,
        onError?: (error: Error) => void
      ) => _emitter.onEach(stream$, onData, onError);

      _callableEmitter.forEach = <T>(
        stream$: Observable<T>,
        onData: (data: T) => State,
        onError?: (error: Error) => State
      ) => _emitter.forEach(stream$, onData, onError);

      const handleEvent = async () => {
        try {
          this._emitters.add(_callableEmitter);
          await eventHandler.call(this, event, _callableEmitter);
        } catch (err) {
          this.onError(err as Error);
          throw err;
        }
      };

      return new Observable<T>((subscriber) => {
        stateToBeEmittedStream$.subscribe(this.emit);

        handleEvent()
          .then(() => subscriber.complete())
          .catch(() => subscriber.complete());

        return () => {
          _callableEmitter.close();
          this._emitters.delete(_callableEmitter);
          stateToBeEmittedStream$.complete();
        };
      });
    };

    const _transformer = transformer ?? Bloc.transformer();

    const transformStream$ = _transformer(
      this._eventSubject$.pipe(
        filter((newEvent): newEvent is T => newEvent instanceof event)
      ),
      mapEventToState
    );

    const subscription = transformStream$.subscribe();

    this._subscriptions.add(subscription);
  }

  /** An instance of the BlocObserver class. */
  static observer: BlocObserver = new BlocObserver();

  /**
   * Adds an event to the BLoC's stream of events.
   *
   * @param event - The event to add.
   *
   * @throws if there is no registered event handler for the given event.
   *
   * @returns The instance of the Bloc.
   */
  add(event: Event) {
    if (!this._eventMap.has(event.constructor as ClassType<Event>)) {
      throw new StateError(`
        add(${event.blockEventName}) was called without a registered event handler.
        Make sure to register a handler via on(${event.blockEventName}, (event, emit) {...})
      `);
    }

    try {
      this.onEvent(event);
      this._eventSubject$.next(event);
    } catch (error) {
      this.onError(error as Error);
    }

    return this;
  }

  /** Closes all the emitters and subscriptions. */
  override close(): void {
    this._emitters.forEach((emitter) => emitter.close());
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this._emitters.clear();
    this._subscriptions.clear();
    super.close();
  }
}

/**
 * Type guard for Bloc objects.
 *
 * @param bloc - The object to check if it's a Bloc.
 *
 * @returns True if the object is a Bloc or has an isBlocInstance property, false otherwise.
 */
export const isBlocInstance = (bloc: any): bloc is Bloc<any, any> => {
  return bloc instanceof Bloc || Boolean(bloc.isBlocInstance);
};
