import {
  EMPTY,
  from,
  Observable,
  Subject,
  Subscription,
  catchError,
  shareReplay,
  map,
  distinctUntilChanged,
  filter,
  BehaviorSubject,
} from "rxjs";
import { BlocBase } from "./base";
import { BlocObserver } from "./bloc-observer";
import { BlocEvent } from "./event";
import { BlocState } from "./state";
import { concurrent } from "./transformer";
import { Transition } from "./transition";
import {
  BlocDataType,
  EventHandler,
  ClassType,
  BlocSelectorConfig,
  EventTransformer,
  Emitter,
  EmitUpdaterCallback,
} from "./types";

export abstract class Bloc<
  Event extends BlocEvent,
  State extends BlocState<any>
> extends BlocBase<State> {
  readonly #eventSubject$ = new Subject<Event>();
  readonly #eventMap = new Map<string, null>();
  readonly #subscriptions = new Set<Subscription>();
  readonly #emitters = new Set<Emitter<State>>();

  readonly #dataSubject: BehaviorSubject<BlocDataType<State>>;
  readonly data$: Observable<BlocDataType<State>>;
  #data: BlocDataType<State>;

  constructor(state: State) {
    super(state);
    const { data } = state.payload;
    this.#dataSubject = new BehaviorSubject(data);
    this.data$ = this.#buildDataStream();
    this.#data = data;
    this.add = this.add.bind(this);
  }

  #buildDataStream() {
    return this.#dataSubject
      .asObservable()
      .pipe(distinctUntilChanged(), shareReplay({ bufferSize: 1, refCount: true }));
  }

  #mapEventToStateError(error: Error): Observable<never> {
    this.onError(error);
    return EMPTY;
  }

  protected override onError(error: Error): void {
    Bloc.observer.onError(this, error);
  }

  protected onTransition(transition: Transition<Event, State>): void {
    Bloc.observer.onTransition(this, transition);
  }

  protected onEvent(event: Event): void {
    Bloc.observer.onEvent(this, event);
  }

  protected on<T extends Event>(
    event: ClassType<T>,
    eventHandler: EventHandler<T, State>,
    transformer: EventTransformer<T> = Bloc.transformer
  ) {
    if (this.#eventMap.has(event.name)) {
      throw new Error(`${event.name} can only have one EventHandler`);
    }

    this.#eventMap.set(event.name, null);

    const mapEventToState = (event: T): Observable<void> => {
      const stateToBeEmittedStream$ = new Subject<State>();
      let disposables: Subscription[] = [];
      let isClosed = false;

      const emitter: Emitter<State> = (newState: State): void => {
        if (isClosed) {
          return;
        }

        let stateToBeEmitted: State | undefined;

        stateToBeEmitted = newState;

        if (stateToBeEmitted !== undefined && this.state !== stateToBeEmitted) {
          try {
            this.onTransition(new Transition(this.state, event, stateToBeEmitted));
            stateToBeEmittedStream$.next(stateToBeEmitted);
          } catch (error) {
            this.onError(error);
          }
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
              resolve();
            },
          });

          disposables.push(subscription);
        });

      emitter.forEach = (stream$, onData, onError) =>
        emitter.onEach(
          stream$,
          (data) => emitter(onData(data)),
          onError ? (error: any) => emitter(onError(error)) : undefined
        );

      emitter.close = () => {
        isClosed = true;
        stateToBeEmittedStream$.complete();
        for (const sub of disposables) {
          sub.unsubscribe();
        }
        disposables = [];
        this.#emitters.delete(emitter);
      };

      this.#emitters.add(emitter);

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
      this.#eventSubject$.pipe(filter((newEvent): newEvent is T => newEvent instanceof event)),
      mapEventToState
    );

    const subscription = transformStream$
      .pipe(catchError((error: Error) => this.#mapEventToStateError(error)))
      .subscribe();

    this.#subscriptions.add(subscription);
  }

  protected get data(): BlocDataType<State> {
    return this.#data;
  }

  override emit(newState: State): void {
    const { hasData, data } = newState.payload;

    try {
      super.emit(newState);

      if (hasData && data !== this.#data) {
        this.#data = data;
        this.#dataSubject.next(data);
      }
    } catch (e) {
      this.onError(e);
    }
  }

  static transformer: EventTransformer<any> = concurrent();

  static observer: BlocObserver = new BlocObserver();

  add(event: Event): void {
    if (!this.#eventSubject$.closed) {
      try {
        this.onEvent(event);
        this.#eventSubject$.next(event);
      } catch (error) {
        this.onError(error);
      }
    }
  }

  filterType<T extends State>(type: ClassType<T>): Observable<T> {
    const typePredicate = (state: State): state is T => state instanceof type;
    return this.state$.pipe(filter(typePredicate));
  }

  filter<T extends State, Data extends BlocDataType<T>>(
    stateFilter: (data: Data) => boolean,
    type?: ClassType<T>
  ): Observable<Data> {
    const typePredicate = type ? (state: T): state is T => state instanceof type : () => true;
    return this.state$.pipe(
      filter(typePredicate),
      filter((state) => state.payload.hasData),
      map((state) => state.payload.data),
      filter(stateFilter),
      distinctUntilChanged(),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  override select<K, T extends State = State>(
    config: BlocSelectorConfig<T, K> | ((state: BlocDataType<T>) => K),
    type?: ClassType<T>
  ): Observable<K> {
    const typePredicate = type ? (state: T): state is T => state instanceof type : () => true;

    if (typeof config === "function") {
      return this.state$.pipe(
        filter(typePredicate),
        filter((state) => state.payload.hasData), // only filter state that has data
        map((state) => state.payload.data), // select only data
        map(config),
        distinctUntilChanged(),
        shareReplay({ refCount: true, bufferSize: 1 })
      );
    }

    const dataFilter = config.filter ?? (() => true);

    return this.state$.pipe(
      filter(typePredicate),
      filter((state) => state.payload.hasData), // only filter state that has data
      map((state) => state.payload.data), // select only data
      map(config.selector),
      filter(dataFilter),
      distinctUntilChanged(),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  override close(): void {
    for (const emitter of this.#emitters) {
      emitter.close();
    }

    for (const sub of this.#subscriptions) {
      sub.unsubscribe();
    }

    this.#emitters.clear();
    this.#subscriptions.clear();
    super.close();
  }
}
