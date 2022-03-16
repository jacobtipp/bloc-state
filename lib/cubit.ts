import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { distinctUntilChanged, map, shareReplay } from "rxjs/operators";

export abstract class Cubit<T = any> {
  constructor(protected _state: T) {
    this._stateSubject$ = new BehaviorSubject(_state);
    this.state$ = this._buildStatePipeline();
    this._stateSubscription = this._subscribeToState();
  }

  readonly state$: Observable<T>;
  private readonly _stateSubject$: BehaviorSubject<T>;
  private readonly _stateSubscription: Subscription;

  protected get state(): T {
    return this._state;
  }

  protected onChange(current: T, next: T): void {}

  protected onError(error: Error): void {}

  protected select<K>(mapState: (state: T) => K): Observable<K> {
    return this.state$.pipe(
      map((state) => mapState(state)),
      distinctUntilChanged()
    );
  }

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
  }

  private _buildStatePipeline(): Observable<T> {
    return this._stateSubject$.asObservable().pipe(shareReplay({ refCount: true, bufferSize: 1 }));
  }

  protected listen(state: T) {
    return;
  }

  private _subscribeToState() {
    return this.state$.subscribe({
      next: (state) => this.listen(state),
      error: (error) => this.onError(error),
    });
  }

  close() {
    this.dispose();
  }
}
