import {
  EMPTY,
  from,
  Observable,
  Subject,
  Subscription,
  catchError,
  shareReplay,
  switchMap,
  tap,
  share,
  map,
  distinctUntilChanged,
  filter,
  flatMap,
  mergeMap,
  of,
} from "rxjs";
import { BlocBase } from "./base";
import { BlocEvent } from "./event";
import { BlocState, isBlocStateInstance } from "./state";
import {
  BlocDataType,
  EmitUpdaterCallback,
  EventHandler,
  EventToStateMapper,
  ClassType,
  BlocSelectorConfig,
  EventTransformer,
  Emitter,
} from "./types";

export abstract class Bloc<
  E extends BlocEvent,
  State extends BlocState<any>
> extends BlocBase<State> {
  constructor(_state: State) {
    super(_state);
    this.emit = this.emit.bind(this);
  }

  private readonly _eventSubject$ = new Subject<E>();

  private readonly _eventMap = new Map<string, null>();

  private readonly _subscriptions: Subscription[] = [];

  private emitters: Emitter<State>[] = [];

  public readonly events$ = this._eventSubject$.asObservable().pipe(share());

  static transformer: EventTransformer<any> = (events$, mapper) => {
    return events$.pipe(mergeMap(mapper));
  };

  /**
   *
   * @param event
   * @param eventHandler
   * @descrition this method is for registering event handlers based on the type of events that
   * are added to a bloc
   */
  protected on<T extends E>(
    event: ClassType<T>,
    eventHandler: EventHandler<T, State>,
    transformer: EventTransformer<T> = Bloc.transformer
  ) {
    if (this._eventMap.has(event.name)) {
      throw new Error(`${event.name} can only have one EventHandler`);
    }

    this._eventMap.set(event.name, null);

    const mapEventToState = (event: T): Observable<void> => {
      const stateToBeEmittedStream$ = new Subject<State>();
      let dispsables: Subscription[] = [];
      let isClosed = false;

      const emitter: Emitter<State> = (newState: State | EmitUpdaterCallback<State>): void => {
        if (stateToBeEmittedStream$.closed || isClosed) {
          return;
        }

        let stateToBeEmitted: State | undefined;

        if (typeof newState === "function") {
          let callback = newState as EmitUpdaterCallback<State>;
          stateToBeEmitted = callback(this.state);
        } else {
          stateToBeEmitted = newState;
        }

        if (stateToBeEmitted !== undefined) {
          stateToBeEmittedStream$.next(stateToBeEmitted);
        }
      };

      emitter.onEach = (stream$, onData, onError) =>
        new Promise((resolve) => {
          const subscription = stream$.subscribe({
            next: onData,
            error: (error) => {
              if (onError != null && error != null) {
                onError(error);
              }
              resolve();
            },
            complete: () => {
              dispsables.find((sub) => (sub = subscription))?.unsubscribe();
              resolve();
            },
          });

          dispsables.push(subscription);
        });

      emitter.forEach = (stream$, onData, onError) => {
        return emitter.onEach(stream$, (data) => emitter(onData(data)), onError);
      };

      emitter.close = () => {
        stateToBeEmittedStream$.complete();
        for (const sub of dispsables) {
          sub.unsubscribe();
        }
        dispsables = [];
      };

      this.emitters.push(emitter);

      return new Observable((subscriber) => {
        stateToBeEmittedStream$.subscribe(this.emit);

        const result = eventHandler(event, emitter);

        if (result instanceof Promise) {
          from(result).subscribe({
            complete: () => subscriber.complete(),
          });
        } else {
          subscriber.complete();
        }

        return () => {
          emitter.close();
        };
      });
    };

    const transformStream$ = transformer(
      this.events$.pipe(filter((newEvent): newEvent is T => newEvent instanceof event)),
      mapEventToState
    );

    const subscription = transformStream$
      .pipe(catchError((error: Error) => this._mapEventToStateError(error)))
      .subscribe();

    this._subscriptions.push(subscription);
  }

  /**
   *
   * @param event Event: E
   * @description add a new bloc event to the bloc event stream
   */
  add(event: E): void {
    if (!this._eventSubject$.closed) {
      try {
        this.onEvent(event);
        this._eventSubject$.next(event);
      } catch (error) {
        this.onError(error);
      }
    }
  }

  // overridable methods for transtions, changes, and errors

  protected override onError(error: Error): void {}

  protected onTransition(current: State, next: State, event: E): void {}

  protected onEvent(event: E): void {}

  /**
   *
   * @param error
   * @description error handler that returns an Observable that emits never as an exception has been thrown
   */
  private _mapEventToStateError(error: Error): Observable<never> {
    this.onError(error);
    return EMPTY;
  }

  public filterType<T extends State>(type: ClassType<T>): Observable<T> {
    const typePredicate = (state: State): state is T => state instanceof type;
    return this.state$.pipe(filter(typePredicate));
  }

  public filter<T extends State>(
    stateFilter: (state: T) => boolean,
    type?: ClassType<T>
  ): Observable<T> {
    if (type) {
      const typePredicate = (state: State): state is T => state instanceof type;
      return this.state$.pipe(filter(typePredicate), filter(stateFilter));
    } else {
      return this.state$.pipe(filter(stateFilter));
    }
  }

  /**
   *
   * @param mapState (state: State) => K
   * @returns new mapped selected state
   */
  public override select<K, T extends State = State>(
    config: BlocSelectorConfig<T, K> | ((state: BlocDataType<T>) => K),
    type?: ClassType<T>
  ): Observable<K> {
    let stream$: Observable<K> = EMPTY;
    const typePredicate = type ? (state: T): state is T => state instanceof type : () => true;
    if ("selector" in config) {
      stream$ = this.state$.pipe(
        filter((state) => state.payload.hasData), // only filter state that has data
        filter(typePredicate),
        map((state) => state.payload.data), // select only data
        map(config.selector),
        filter(config.filter ?? (() => true))
      );
    } else if (typeof config === "function") {
      stream$ = this.state$.pipe(
        filter((state) => state.payload.hasData), // only filter state that has data
        filter(typePredicate),
        map((state) => state.payload.data), // select only data
        map(config)
      );
    }

    return stream$.pipe(distinctUntilChanged(), shareReplay({ refCount: true, bufferSize: 1 }));
  }

  override close(): void {
    super.close();

    for (const sub of this._subscriptions) {
      sub.unsubscribe();
    }

    for (const emitter of this.emitters) {
      emitter.close();
    }
  }
}
