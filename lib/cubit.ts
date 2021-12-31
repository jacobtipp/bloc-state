import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, filter, map, shareReplay, skip, tap } from "rxjs/operators";
import { BlocState } from ".";

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

  protected abstract onTransition(current: T, next: T): void;

  protected abstract onError(error: Error): void;

  protected transitionHandler(current: T, next: T) {
    if (this.onTransition) {
      this.onTransition(current, next);
    }
  }

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
      this._stateSubject$.next(newState);
    }
  }

  protected dispose(): void {
    this._stateSubject$.complete();
  }

  private _buildStatePipeline(): Observable<T> {
    return this._stateSubject$.asObservable().pipe(
      distinctUntilChanged(),
      tap((newState) => {
        if (newState !== this._state) {
          this.transitionHandler(this._state, newState);
          this._state = newState;
        }
      }),
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
