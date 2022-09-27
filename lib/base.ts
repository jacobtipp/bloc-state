import {
  BehaviorSubject,
  Observable,
  Subscription,
  distinctUntilChanged,
  shareReplay,
  map,
  filter,
  EMPTY,
} from "rxjs";
import { CubitSelectorConfig, EmitUpdaterCallback } from "./types";

export abstract class BlocBase<State = any> {
  private blocListenerStreamSubscription: Subscription = Subscription.EMPTY;
  private blocListenerIsActive = false;

  constructor(private _state: State) {
    this.emit = this.emit.bind(this);
    this._stateSubject$ = new BehaviorSubject(_state);
    this.state$ = this._buildStatePipeline();
    this._stateSubscription = this._subscribeStateoState();
  }

  listen<T = any>(
    stream: Observable<T>,
    listenHandler: (state: T, bloc: typeof this) => void
  ): void {
    if (!this.blocListenerIsActive) {
      this.blocListenerIsActive = true;
      this.blocListenerStreamSubscription = stream.subscribe({
        next: (state) => listenHandler(state, this),
      });
    }
  }

  /**
   * @returns the last emitted state in a cubit
   */
  get state(): State {
    return this._state;
  }

  private readonly _stateSubject$: BehaviorSubject<State>;

  /**
   * emits state pushed into a cubit
   */
  readonly state$: Observable<State>;

  private readonly _stateSubscription: Subscription;

  private _subscribeStateoState(): Subscription {
    return this.state$.subscribe();
  }

  private _buildStatePipeline(): Observable<State> {
    return this._stateSubject$
      .asObservable()
      .pipe(distinctUntilChanged(), shareReplay({ refCount: true, bufferSize: 1 }));
  }

  /**
   * @override
   * @param error
   */
  protected onError(error: Error): void {}

  /**
   *
   * @param newState new state to be emitted
   * @returns void
   */
  public emit(newState: State | EmitUpdaterCallback<State>): void {
    if (!this._stateSubject$.closed) {
      let stateToBeEmitted: State | undefined;

      if (typeof newState === "function") {
        try {
          let callback = newState as EmitUpdaterCallback<State>;
          stateToBeEmitted = callback(this.state);
        } catch (error) {
          this.onError(error);
        }
      } else {
        stateToBeEmitted = newState;
      }

      if (stateToBeEmitted !== undefined && this._state !== stateToBeEmitted) {
        try {
          this.onChange(this._state, stateToBeEmitted);
          this._state = stateToBeEmitted;
          this._stateSubject$.next(stateToBeEmitted);
        } catch (error) {
          this.onError(error);
        }
      }
    }
  }

  /**
   * @override
   * @param current State
   * @param next State
   */
  protected onChange(current: State, next: State): void {}

  /**
   *
   * @param mapState (state: State) => K
   * @returns new mapped selected state
   */
  public select<K>(config: CubitSelectorConfig<State, K> | ((state: State) => K)): Observable<K> {
    let stream$: Observable<K> = EMPTY;

    if ("selector" in config) {
      stream$ = this.state$.pipe(map(config.selector), filter(config.filter ?? (() => true)));
    } else if (typeof config === "function") {
      stream$ = this.state$.pipe(map(config));
    }

    return stream$.pipe(distinctUntilChanged(), shareReplay({ refCount: true, bufferSize: 1 }));
  }

  close() {
    this._stateSubject$.complete();
    this._stateSubscription.unsubscribe();
    this.blocListenerStreamSubscription.unsubscribe();
  }
}
