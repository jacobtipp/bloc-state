import { EMPTY, from, Observable, of, Subject, Subscription } from "rxjs";
import { catchError, concatMap, mergeMap, tap } from "rxjs/operators";
import { Cubit } from "./cubit";
import { BlocEvent } from "./event";

export type Emitter<S> = (state: S) => void;

export type EventHandler<E, S> = (event: E, emitter: Emitter<S>) => void | Promise<void>;

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export abstract class Bloc<E extends BlocEvent, State> extends Cubit<State> {
  constructor(state: State) {
    super(state);
    this.emit = this.emit.bind(this);
    this._mapEventToState = this._mapEventToState.bind(this);
    this._eventsSubscription = this._subscribeToEvents();
  }

  private readonly _events$ = new Subject<E>();
  private readonly _eventsMap = new Map<string, EventHandler<E, State>>();
  private readonly _eventsSubscription: Subscription;

  private _event: E | undefined;

  /**
   *
   * @param event
   * @param eventHandler
   * @descrition this method is for registering event handlers based on the type of events that
   * are added to a bloc
   */
  protected on<T extends E>(event: Type<T>, eventHandler: EventHandler<T, State>) {
    if (this._eventsMap.has(event.name)) {
      throw new Error(`Error: ${event} can only have one EventHandler`);
    }

    this._eventsMap.set(event.name, eventHandler);
  }

  /**
   * @returns the current state
   */
  protected override get state(): State {
    return this._state;
  }

  /**
   *
   * @param event Event: E
   * @description add a new bloc event to the bloc event stream
   */
  addEvent(event: E): void {
    if (!this._events$.closed) {
      this._events$.next(event);
    }
  }

  // overridable methods for transtions, changes, and errors

  protected override listen(state: State) {
    return;
  }

  protected override onError(error: Error): void {
    return;
  }

  protected override onChange(current: State, next: State): void {
    this.onTransition(current, next, this._event!);
  }

  protected onTransition(current: State, next: State, event: E): void {
    return;
  }

  protected onEvent(event: E): void {
    return;
  }

  /**
   *
   * @param events$ incoming events
   * @param next (event: E) => Observable<void>
   * @returns transformed events Observable
   */
  protected transformEvents(events$: Observable<E>, next: (event: E) => Observable<void>) {
    return events$.pipe(concatMap(next));
  }

  /**
   * @description subscribes to event stream to initialize a bloc and process events
   * @returns Subscription
   */
  private _subscribeToEvents(): Subscription {
    return this._events$
      .pipe(
        tap((event) => this.onEvent(event)),
        tap((event) => (this._event = event)),
        mergeMap((event) => {
          return this.transformEvents(of(event), this._mapEventToState);
        }),
        catchError((error: Error) => this._mapEventToStateError(error))
      )
      .subscribe();
  }

  /**
   * @param event BlocEvent
   * @returns Observable
   * @description retrieves event handler from eventsMap if it exists and returns an empty observable
   */
  private _mapEventToState(event: E): Observable<void> {
    const handler = this._eventsMap.get(event.blockEventName);

    if (handler === undefined) {
      return EMPTY;
    }

    let result = handler(event, this.emit);

    return result instanceof Promise ? from(result) : EMPTY;
  }

  /**
   *
   * @param error
   * @description error handler that returns an Observable that emits never as an exception has been thrown
   */
  private _mapEventToStateError(error: Error): Observable<never> {
    this.onError(error);
    return EMPTY;
  }

  private _dispose(): void {
    this._eventsSubscription.unsubscribe();
    super.dispose();
  }

  override close(): void {
    this._dispose();
  }
}
