import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { distinctUntilChanged, map, shareReplay } from "rxjs/operators";

export abstract class Cubit<T = any> {
  constructor(protected _state: T) {
    this._stateSubject$ = new BehaviorSubject(_state);
    this.state$ = this._buildStatePipeline();
    this._stateSubscription = this._subscribeToState();
  }

  /**
   * emits state pushed into a cubit
   */
  readonly state$: Observable<T>;

  private readonly _stateSubject$: BehaviorSubject<T>;
  private readonly _stateSubscription: Subscription;

  /**
   * @returns the last emitted state in a cubit
   */
  protected get state(): T {
    return this._state;
  }

  /**
   * @override
   * @param current State
   * @param next State
   */
  protected onChange(current: T, next: T): void {}

  /**
   * @override
   * @param error
   */
  protected onError(error: Error): void {}

  /**
   *
   * @param mapState (state: T) => K
   * @returns new mapped selected state
   */
  protected select<K>(mapState: (state: T) => K): Observable<K> {
    return this.state$.pipe(
      map((state) => mapState(state)),
      distinctUntilChanged()
    );
  }

  /**
   *
   * @param newState new state to be emitted
   * @returns void
   */
  protected emit(newState: T): void {
    if (this._stateSubject$.closed) {
      return;
    }

    if (this._state !== newState) {
      this.onChange(this._state, newState);
      this._state = newState;
      this._stateSubject$.next(newState);
    }
  }

  protected dispose(): void {
    this._stateSubject$.complete();
    this._stateSubscription.unsubscribe();
  }

  /**
   *
   * @returns multicasted observable state
   */
  private _buildStatePipeline(): Observable<T> {
    return this._stateSubject$.asObservable().pipe(shareReplay({ refCount: true, bufferSize: 1 }));
  }

  /**
   *
   * @param state current emitted state
   * @returns void
   */
  protected listen(state: T): void {
    return;
  }

  private _subscribeToState(): Subscription {
    return this.state$.subscribe({
      next: (state) => this.listen(state),
      error: (error) => this.onError(error),
    });
  }

  close() {
    this.dispose();
  }
}
