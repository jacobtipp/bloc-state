import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, map, shareReplay, tap } from "rxjs/operators";

export abstract class Cubit<T = any> {
  private readonly _state$: Observable<T>;

  private readonly _stateSubject$: BehaviorSubject<T>;

  state$: Observable<T>;

  constructor(protected _state: T) {
    this._stateSubject$ = new BehaviorSubject(_state);
    this._state$ = this._buildStatePipeline();
    this.state$ = this.select((state) => state);
    this._listen();
  }

  protected get state(): T {
    return this._state;
  }

  protected onChange(current: T, next: T): void { }

  protected onError(error: Error): void { }

  protected errorHandler(error: Error) {
    if (this.onError) {
      this.onError(error);
    }
  }

  protected select<K>(mapState: (state: T) => K): Observable<K> {
    return this._state$.pipe(
      map((state) => mapState(state)),
      distinctUntilChanged()
    );
  }

  protected emit(newState: T): void {
    if (!this._stateSubject$.closed) {
      if (this._state !== newState) {
        this.onChange(this._state, newState);
        this._state = newState;
        this._stateSubject$.next(newState);
      }
    }
  }

  protected dispose(): void {
    this._stateSubject$.complete();
  }

  private _buildStatePipeline(): Observable<T> {
    return this._stateSubject$.asObservable().pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  private _listen() {
    this._state$.subscribe({
      error: (error) => this.errorHandler(error),
    });
  }

  close() {
    this.dispose();
  }
}
