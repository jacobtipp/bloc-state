import { EMPTY, from, Observable, of, Subject, Subscription } from "rxjs";
import { catchError, shareReplay, switchMap, tap, share } from "rxjs/operators";
import { BlocBase } from "./base";
import { Cubit } from "./cubit";
import { BlocEvent } from "./event";
import { BlocState } from "./state";
import { Emitter, EmitUpdaterCallback, EventHandler, EventToStateMapper, Type } from "./types";

export abstract class Bloc<
  E extends BlocEvent,
  State extends BlocState<any>
> extends BlocBase<State> {
  constructor(_state: State) {
    super(_state);
    this.emit = this.emit.bind(this);
    this._mapEventToState = this._mapEventToState.bind(this);
    this._eventsSubscription = this._subscribeToEvents();
  }

  private readonly _events$ = new Subject<E>();
  private readonly _eventsMap = new Map<string, EventHandler<E, State>>();
  private readonly _eventsSubscription: Subscription;

  private _event: E | undefined;

  public readonly events$ = this._events$.asObservable().pipe(share());

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

    this._eventsMap.set(event.name, eventHandler.bind(this));
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

  protected transformEvents(
    events: Observable<E>,
    next: EventToStateMapper<E, State>
  ): Observable<State> {
    return events.pipe(switchMap(next));
  }

  protected trans(events: E, next: (event: E) => void): void {
    return;
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

  /**
   * @description subscribes to event stream to initialize a bloc and process events
   * @returns Subscription
   */
  private _subscribeToEvents(): Subscription {
    const eventStream$ = this._events$.pipe(
      tap((event) => this.onEvent(event)),
      tap((event) => (this._event = event))
    );

    const transformedStream = this.transformEvents(eventStream$, this._mapEventToState);

    return transformedStream
      .pipe(catchError((error: Error) => this._mapEventToStateError(error)))
      .subscribe();
  }

  /**
   * @param event BlocEvent
   * @returns Observable
   * @description retrieves event handler from eventsMap if it exists and returns an empty observable
   */
  private _mapEventToState(event: E): Observable<State> {
    const handler = this._eventsMap.get(event.blockEventName);

    if (handler === undefined) {
      return EMPTY;
    }

    const mapEventSubject$ = new Subject<State>();

    const emitter = (newState: State | EmitUpdaterCallback<State>): void => {
      if (mapEventSubject$.closed) {
        return;
      }

      let stateToBeEmitted: State;

      if (typeof newState === "function") {
        let callback = newState as EmitUpdaterCallback<State>;
        stateToBeEmitted = callback(this.state);
      } else {
        stateToBeEmitted = newState;
      }

      mapEventSubject$.next(stateToBeEmitted);
    };

    return new Observable((subscriber) => {
      mapEventSubject$.subscribe(this.emit);

      const result = handler(event, emitter);

      if (result instanceof Promise) {
        from(result).subscribe({
          complete: () => subscriber.complete(),
        });
      } else {
        subscriber.complete();
      }

      return () => {
        mapEventSubject$.complete();
      };
    });
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

  override close(): void {
    this._dispose();
  }

  private _dispose(): void {
    this._eventsSubscription.unsubscribe();
    super.close();
  }
}
