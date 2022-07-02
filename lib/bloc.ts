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
    this._mapEventToState = this._mapEventToState.bind(this);
    this.emit = this.emit.bind(this);
    this._eventsSubscription = this._subscribeToEvents();
  }

  private readonly _events$ = new Subject<E>();
  private readonly _eventsMap = new Map<string, EventHandler<E, State>>();
  private readonly _eventsSubscription: Subscription;

  private _event: E | undefined;

  protected on<T extends E>(event: Type<T>, eventHandler: EventHandler<T, State>) {
    if (this._eventsMap.has(event.name)) {
      throw new Error(`Error: ${event} can only have one EventHandler`);
    }

    this._eventsMap.set(event.name, eventHandler);
  }

  protected override get state(): State {
    return this._state;
  }

  addEvent(event: E): void {
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

  protected onTransition(current: State, next: State, event: E): void {
    return;
  }

  protected onEvent(event: E): void {
    return;
  }

  protected transformEvents(events$: Observable<E>, next: (event: E) => Observable<void>) {
    return events$.pipe(concatMap(next));
  }

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

  private _mapEventToState(event: E): Observable<void> {
    const handler = this._eventsMap.get(event.blockEventName);

    if (handler === undefined) {
      return EMPTY;
    }

    let result = handler(event, this.emit);

    return result instanceof Promise ? from(result) : EMPTY;
  }

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
