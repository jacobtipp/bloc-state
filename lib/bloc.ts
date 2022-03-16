import { EMPTY, from, Observable, of, Subject, Subscription } from "rxjs";
import { catchError, concatMap, mergeMap, tap } from "rxjs/operators";
import { Cubit } from "./cubit";

export type Emitter<S> = (state: S) => void;
export type EventHandler<E, S> = (event: E, emitter: Emitter<S>) => void | Promise<void>;
export type EventClass<E> = new (...args: any[]) => E;

export abstract class Bloc<Event extends {}, State> extends Cubit<State> {
  constructor(state: State) {
    super(state);
    this._eventsSubscription = this._subscribeToEvents();
  }

  private readonly _events$ = new Subject<Event>();
  private readonly _eventMap = new Map<string, EventHandler<Event, State>>();
  private readonly _eventsSubscription: Subscription;

  private _event: Event | undefined;

  protected on<E extends Event>(event: EventClass<E>, eventHandler: EventHandler<E, State>) {
    if (this._eventMap.get(event.name)) {
      throw new Error(`Error: ${event.name} can only have one EventHandler`);
    }
    this._eventMap.set(event.name, eventHandler.bind(this));
  }

  protected override get state(): State {
    return this._state;
  }

  addEvent(event: Event): void {
    if (!this._events$.closed) {
      this._events$.next(event);
    }
  }

  protected override listen(state: State) {
    return;
  }

  protected override onError(error: Error): void {
    return;
  }

  protected override onChange(current: State, next: State): void {
    this.onTransition(current, next, this._event!);
  }

  protected onTransition(current: State, next: State, event: Event): void {
    return;
  }

  protected onEvent(event: Event): void {
    return;
  }

  protected transformEvents(events$: Observable<Event>, next: (event: Event) => Observable<void>) {
    return events$.pipe(concatMap(next));
  }

  private _subscribeToEvents(): Subscription {
    return this._events$
      .pipe(
        tap((event) => this.onEvent(event)),
        tap((event) => (this._event = event)),
        mergeMap((event) => {
          return this.transformEvents(of(event), this._mapEventToState.bind(this));
        }),
        catchError((error: Error) => this._mapEventToStateError(error))
      )
      .subscribe();
  }

  private _mapEventToState(event: Event): Observable<void> {
    let eventHandler = this._eventMap.get(event.constructor.name);
    if (eventHandler === undefined) {
      return EMPTY;
    }

    let result = eventHandler(event, this.emit.bind(this));

    return result instanceof Promise ? from(result) : EMPTY;
  }

  private _mapEventToStateError(error: Error): Observable<never> {
    this.onError(error);
    return EMPTY;
  }

  private _dispose(): void {
    this._eventsSubscription.unsubscribe();
    this._eventMap.clear();
    super.dispose();
  }

  override close(): void {
    this._dispose();
  }
}
