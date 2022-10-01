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
import { BlocObserver } from "./bloc-observer";
import { BlocEvent } from "./event";
import { BlocState, isBlocStateInstance } from "./state";
import { concurrent } from "./transformer";
import { Transition } from "./transition";
import {
  BlocDataType,
  EmitUpdaterCallback,
  EventHandler,
  ClassType,
  BlocSelectorConfig,
  EventTransformer,
  Emitter,
} from "./types";

export abstract class Bloc<
  Event extends BlocEvent,
  State extends BlocState<any>
> extends BlocBase<State> {
  constructor(_state: State) {
    super(_state);
  }

  private readonly _eventSubject$ = new Subject<Event>();

  private readonly _eventMap = new Map<string, null>();

  private readonly _subscriptions: Subscription[] = [];

  private emitters: Emitter<State>[] = [];

  public readonly events$ = this._eventSubject$.asObservable().pipe(share());

  static transformer: EventTransformer<any> = concurrent();

  static observer: BlocObserver = new BlocObserver();
  /**
   *
   * @param event
   * @param eventHandler
   * @descrition this method is for registering event handlers based on the type of events that
   * are added to a bloc
   */
  protected on<T extends Event>(
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
          this.onTransition(new Transition(this.state, event, stateToBeEmitted));
          stateToBeEmittedStream$.next(stateToBeEmitted);
        }
      };

      emitter.onEach = (stream$, onData, onError) => {
        return new Promise((resolve) => {
          const subscription = stream$.subscribe({
            next: onData,
            error: (error) => {
              if (onError != null && error != null) {
                onError(error);
              }
              resolve();
            },
            complete: () => {
              resolve();
            },
          });

          dispsables.push(subscription);
        });
      };

      emitter.forEach = (stream$, onData, onError) => {
        return emitter.onEach(
          stream$,
          (data) => emitter(onData(data)),
          onError ? (error: any) => emitter(onError(error)) : undefined
        );
      };

      emitter.close = () => {
        isClosed = true;
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
      this._eventSubject$.pipe(filter((newEvent): newEvent is T => newEvent instanceof event)),
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
  add(event: Event): void {
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

  protected override onError(error: Error): void {
    Bloc.observer.onError(this, error);
  }

  protected onTransition(transition: Transition<Event, State>): void {
    Bloc.observer.onTransition(this, transition);
  }

  protected onEvent(event: Event): void {
    Bloc.observer.onEvent(this, event);
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
      const dataFilter = config.filter ?? (() => true);
      stream$ = this.state$.pipe(
        filter((state) => state.payload.hasData), // only filter state that has data
        filter(typePredicate),
        map((state) => state.payload.data), // select only data
        map(config.selector),
        filter(dataFilter)
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
    for (const emitter of this.emitters) {
      emitter.close();
    }

    for (const sub of this._subscriptions) {
      sub.unsubscribe();
    }

    super.close();
  }
}
