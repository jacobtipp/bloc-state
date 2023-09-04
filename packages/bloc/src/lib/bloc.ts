import { filter, merge, mergeMap, Observable, Subject } from 'rxjs';

import { BlocBase } from './base';
import { BlocObserver } from './bloc-observer';
import { Emitter, BlocEmitterImpl } from './emitter';
import { StateError } from './errors';
import { Transition } from './transition';
import { ClassType, EventHandler, EventTransformer } from './types';
import {
  AtomBase,
  AtomBaseProps,
  AtomBloc,
  AtomBlocProps,
  AtomCubitProps,
  Getter,
  StateWatcher,
  stateWatcher,
} from './atom';
import { Change } from './change';

/**
 * An abstract class representing a BLoC.
 *
 * @template Event - The generic type of the event.
 * @template State - The generic type of the state.
 */
export abstract class Bloc<Event, State> extends BlocBase<State> {
  /**
   * Creates a new instance of the Bloc class.
   *
   * @param state - The initial state of the BLoC.
   */
  constructor(state: State, name?: string) {
    super(state, name);
    this.on = this.on.bind(this);
    this.add = this.add.bind(this);
    this.emit = this.emit.bind(this);
  }

  /** An observable stream of BLoC events. */
  private readonly _eventSubject$ = new Subject<Event>();

  /** A mapping of registered events to their corresponding handler. */
  private readonly _eventMap = new WeakMap<ClassType<Event>, 1>();

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

      const emitter = new BlocEmitterImpl(onEmit.bind(this));

      const callableEmitter = (state: State) => emitter.call(state);

      callableEmitter.close = () => {
        isClosed = true;
        emitter.close();
      };

      callableEmitter.onEach = <T>(
        stream$: Observable<T>,
        onData: (data: T) => void,
        onError?: (error: Error) => void
      ) => emitter.onEach(stream$, onData, onError);

      callableEmitter.forEach = <T>(
        stream$: Observable<T>,
        onData: (data: T) => State,
        onError?: (error: Error) => State
      ) => emitter.forEach(stream$, onData, onError);

      const handleEvent = async () => {
        try {
          this._emitters.add(callableEmitter);
          await eventHandler.call(this, event, callableEmitter);
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
          callableEmitter.close();
          this._emitters.delete(callableEmitter);
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

    this.subscriptions.add(subscription);
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
    const prototype = Object.getPrototypeOf(event).constructor;
    const hasEvent = this._eventMap.has(prototype);
    if (!hasEvent) {
      throw new StateError(`
        add(${event}) was called without a registered event handler.
        Make sure to register a handler via on(${event}, (event, emit) {...})
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

  /** Closes all the emitters */
  override close(): void {
    this._emitters.forEach((emitter) => emitter.close());
    this._emitters.clear();
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

export class AtomBlocImpl<
  Event,
  State,
  Props extends AtomBaseProps<State>
> extends Bloc<Event, State> {
  constructor(state: State, props: Props, get: Getter, watcher: StateWatcher) {
    super(state, props.name);
    this.props = props;
    this.watcher = watcher;
    this.chainableOn = this.chainableOn.bind(this);
    this.setState = this.setState.bind(this);
    if (watcher.size > 0)
      this.subscriptions.add(
        merge(...watcher.watched).subscribe(() => {
          this.emit((watcher.state as (getter: Getter) => State)(get));
        })
      );
  }

  readonly props: AtomBaseProps<State>;

  readonly watcher: StateWatcher;

  chainableOn<T extends Event>(
    event: ClassType<T>,
    eventHandler: EventHandler<T, State>,
    transformer?: EventTransformer<T>
  ): this {
    this.on(event, eventHandler, transformer);
    return this;
  }

  setState(newState: State | ((currentState: State) => State)): void {
    if (typeof newState === 'function')
      this.emit((newState as (currentState: State) => State)(this.state));
    else this.emit(newState);
  }

  protected override onClose(): void {
    super.onClose();
    if (this.props.onClose) this.props.onClose.call(this);
  }

  protected override onChange(change: Change<State>): void {
    super.onChange(change);
    if (this.props.onChange) this.props.onChange.call(this, change);
  }

  protected override onError(error: Error): void {
    super.onError(error);
    if (this.props.onError) this.props.onError.call(this, error);
  }

  protected override onTransition(transition: Transition<Event, State>): void {
    super.onTransition(transition);
    const props = this.props as AtomBlocProps<Event, State>;
    if (props.onTransition) props.onTransition.call(this, transition);
  }

  protected override onEvent(event: Event): void {
    super.onEvent(event);
    const props = this.props as AtomBlocProps<Event, State>;
    if (props.onEvent) props.onEvent.call(this, event);
  }

  override close(): void {
    this.watcher.clear();
    super.close();
  }
}

export const bloc =
  <Event, State>(state: State | ((get: Getter) => State)) =>
  <
    A = unknown,
    R = unknown extends Event ? AtomBase<State> & A : AtomBloc<Event, State>
  >(
    props: unknown extends Event
      ? AtomCubitProps<State, A>
      : AtomBlocProps<Event, State>
  ): R => {
    let setup = false;
    const watcher = stateWatcher(state);
    const get: Getter = <S>(bloc: AtomBase<S>) => {
      if (!setup) {
        watcher.add(bloc.state$);
      }
      return bloc.state;
    };
    const blocState =
      typeof state === 'function'
        ? (state as (getter: Getter) => State)(get)
        : state;
    setup = true;

    const atomBloc = new AtomBlocImpl(blocState, props, get, watcher);
    let actions = {} as Record<string, A>;

    if ('actions' in props && props.actions) {
      actions = props.actions(atomBloc.setState) as Record<string, A>;

      for (const action in actions) {
        const prop = actions[action];
        if (typeof prop === 'function') {
          actions[action] = prop.bind(actions);
        }
      }

      // make sure bound actions have state getter and the atom name property defined
      Object.defineProperties(actions, {
        state: {
          get: function () {
            return atomBloc.state;
          },
        },
        name: {
          value: atomBloc.name,
        },
      });
    }

    return {
      get state() {
        return atomBloc.state;
      },
      ...actions,
      on: atomBloc.chainableOn,
      add: atomBloc.add,
      name: props.name,
      state$: atomBloc.state$,
      close: atomBloc.close,
    } as R;
  };
