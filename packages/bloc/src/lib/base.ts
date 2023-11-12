import { Observable, Subscription, Subject } from 'rxjs';
import { Bloc } from './bloc';
import { Change } from './change';
import { StateError } from './errors';

/**
 * Base class for implementing BLoC pattern.
 *
 * @typeParam State - The type of the state maintained by the BLoC.
 */
export abstract class BlocBase<State = unknown> {
  /**
   * Initializes a new instance of the `BlocBase` class.
   *
   * @param state - The initial state of the BLoC.
   */
  constructor(state: State, name?: string) {
    this._state = state;
    this._stateSubject$ = new Subject();
    this.state$ = this._stateSubject$;

    // Gets the name of the constructor function for this BLoC instance.
    this.name = name ?? this.constructor.name;

    this.subscriptions.add(this.state$.subscribe());

    // Executes the BlocObserver's `onCreate` method specific to this BLoC.
    Bloc.observer.onCreate(this);
  }

  /**
   * The name of the BLoC instance.
   */
  readonly name: string;

  /**
   * A read-only observable stream of the state maintained by the BLoC.
   */
  readonly state$: Observable<State>;

  /** A set of stream subscriptions that a bloc has subscribed to. */
  protected readonly subscriptions = new Set<Subscription>();

  /**
   * Whether or not the BLoC instance has been closed.
   */
  protected _isClosed = false;

  /**
   * Whether or not the current state has been emitted.
   */
  protected _emitted = false;

  /**
   * The current state of the BLoC.
   */
  private _state: State;

  /**
   * The subject that publishes changes in the state of the BLoC.
   */
  private readonly _stateSubject$: Subject<State>;

  /**
   * Returns the current state of the BLoC.
   *
   * @returns The current state of the BLoC.
   */
  get state(): State {
    return this._state;
  }

  /**
   * Returns whether or not the BLoC instance has been closed.
   *
   * @returns Whether or not the BLoC instance has been closed.
   */
  get isClosed() {
    return this._isClosed;
  }

  /**
   * Executes when the BLoC encounters an error.
   *
   * @param error - The error encountered by the BLoC.
   */
  protected onError(error: Error): void {
    Bloc.observer.onError(this, error);
  }

  /**
   * Executes when the state of the BLoC changes.
   *
   * @param change - Information about the change in state of the BLoC.
   */
  protected onChange(change: Change<State>): void {
    Bloc.observer.onChange(this, change);
  }

  /**
   * Executes when the BLoC instance is closed.
   */
  protected onClose() {
    Bloc.observer.onClose(this);
  }

  /**
   * Emits new BLoC state, this should only be used in development (Redux/React Devtools) and testing.
   */
  __unsafeEmit__(newState: State): void {
    return this.emit(newState);
  }

  /**
   * Emits a new state for the BLoC.
   *
   * @param newState - The new state of the BLoC.
   */
  protected emit(newState: State): void {
    try {
      if (this._isClosed) {
        throw new StateError('Cannot emit new states after calling close');
      }

      if (newState == this._state && this._emitted) return;

      const previous = this.state;

      // Sets the new state and notifies observers.
      this._state = newState;
      this._stateSubject$.next(newState);
      // Notifies observers of the change in state.
      this.onChange(new Change(previous, newState));

      // Marks the current state as emitted.
      this._emitted = true;
    } catch (error) {
      // Executes when the BLoC encounters an error.
      this.onError(error as Error);
      throw error;
    }
  }

  fromJson(json: string): State {
    return JSON.parse(json) as State;
  }

  toJson(state: State): string {
    return JSON.stringify(state);
  }

  /**
   * Closes the BLoC instance.
   */
  close() {
    this._isClosed = true;
    this._stateSubject$.complete();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.clear();

    // Executes when the BLoC instance is closed.
    this.onClose();
  }
}
