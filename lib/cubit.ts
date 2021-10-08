import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";
import { catchError, filter, shareReplay, tap } from "rxjs/operators";
import { distinctUntilChanged, map } from "rxjs/operators";
import { BlocState } from ".";
import * as deepEqual from "fast-deep-equal";
import { BlocEvent } from "./event";
import { BlocError } from "./error";

export abstract class Cubit<T extends BlocState> {
  private readonly _stateSubject$: BehaviorSubject<T>;
  private readonly _state$: Observable<T>;
  state$: Observable<T>;

  constructor(private _state: T) {
    this._stateSubject$ = new BehaviorSubject(_state);
    this._state$ = this._buildStatePipeline();
    this.state$ = this.select((state) => state);
    this._listen();
  }

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

  /**
   * * Getter to retrive the current snapshot of our state directly from the subject
   *  @returns {T}
   */
  protected get state(): T {
    return this._state;
  }

  protected transitionHandler(current: T, next: T) {}
  protected errorHandler(error: Error) {}

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
    this._stateSubject$.next(Object.freeze(newState));
  }

  close() {
    this.dispose();
  }

  /**
   * * Dispose the cubit by setting the state to complete, closing the stream
   */
  protected dispose(): void {
    this._stateSubject$.complete();
  }
}
