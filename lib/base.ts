import {
  BehaviorSubject,
  Observable,
  Subscription,
  distinctUntilChanged,
  shareReplay,
  map,
  filter,
} from "rxjs";
import { EmitUpdaterCallback } from "./types";

export abstract class BlocBase<State = any> {
  private blocListenerStreamSubscription: Subscription = Subscription.EMPTY;
  private blocListenerIsActive = false;

  constructor(private _state: State) {
    this.emit = this.emit.bind(this);
    this._stateSubject$ = new BehaviorSubject(_state);
    this.state$ = this._buildStatePipeline();
    this._stateSubscription = this._subscribeStateoState();
  }

  listen<T = any>(stream: Observable<T>, listenHandler: (state: T) => void): void {
    if (!this.blocListenerIsActive) {
      this.blocListenerStreamSubscription = stream.subscribe(listenHandler);
      this.blocListenerIsActive = true;
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
    return this.state$.subscribe({
      error: (error) => this.onError(error),
    });
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
    if (this._stateSubject$.closed) {
      return;
    }

    let stateToBeEmitted: State | undefined;

    if (typeof newState === "function") {
      let callback = newState as EmitUpdaterCallback<State>;
      stateToBeEmitted = callback(this.state);
    } else {
      stateToBeEmitted = newState;
    }

    if (stateToBeEmitted !== undefined && this._state !== stateToBeEmitted) {
      this.onChange(this._state, stateToBeEmitted);
      this._state = stateToBeEmitted;
      this._stateSubject$.next(stateToBeEmitted);
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
  public select<K>(
    mapState: (state: State) => K,
    stateFilter: (state: State) => boolean = () => true
  ): Observable<K> {
    return this.state$.pipe(
      filter(stateFilter),
      map((state) => mapState(state)),
      distinctUntilChanged(),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  close() {
    this.dispose();
  }

  private dispose(): void {
    this._stateSubject$.complete();
    this._stateSubscription.unsubscribe();
  }
}
