import { BehaviorSubject, Observable } from "rxjs";
import { shareReplay, tap } from "rxjs/operators";
import { distinctUntilChanged, map } from "rxjs/operators";
import { BlocState } from ".";
import * as deepEqual from "fast-deep-equal";

export abstract class Cubit<T extends BlocState> {
  constructor(private _state: T) {
    this._stateSubject$ = new BehaviorSubject(_state);
    this._state$ = this._buildStatePipeline();
    this.state$ = this.select((state) => state);
    this._listen();
  }

  public state$: Observable<T>;
  public close() {
    this.dispose();
  }

  private readonly _stateSubject$: BehaviorSubject<T>;
  private readonly _state$: Observable<T>;

  private _buildStatePipeline() {
    return this._stateSubject$.asObservable().pipe(
      distinctUntilChanged((previous, current) => deepEqual(previous, current)),
      tap((state) => this.transitionHandler(this._state, state)),
      tap((state) => (this._state = state)),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  private _listen() {
    this._state$.subscribe({
      error: (error) => this.errorHandler(error),
    });
  }

  protected transitionHandler(current: T, next: T) {}
  protected errorHandler(error: Error) {}

  /**
   * * Getter to retrieve the current snapshot of the state directly from the subject
   *  @returns {T}
   */
  protected get state(): T {
    return this._state;
  }

  /**
   * * Creates an Observable stream mapped to only a selected part of the state.
   * * The stream will emit data only when the mapped portion has changed.
   * @param mapFn
   * @returns {Observable<K>} Observable<K>
   */

  protected select(filterState: (state: T) => T): Observable<T> {
    return this._state$.pipe(
      map((state) => filterState(state)),
      distinctUntilChanged((previous, current) => deepEqual(previous, current))
    );
  }

  /**
   * * Push a new immutable state snapshot
   * @param {T} newState
   */
  protected emit(newState: T): void {
    if (!this._stateSubject$.closed) {
      this._stateSubject$.next(Object.freeze(newState));
    }
  }

  /**
   * * Dispose the cubit by setting the state to complete, closing the stream
   */
  protected dispose(): void {
    this._stateSubject$.complete();
  }
}
