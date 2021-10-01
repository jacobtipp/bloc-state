import { BehaviorSubject, Observable, Subject } from "rxjs";
import { filter, shareReplay } from "rxjs/operators";
import { distinctUntilChanged, map } from "rxjs/operators";
import { BlocState } from ".";
import { BlocError } from "./error";

export abstract class Cubit<T extends BlocState> {
  private readonly _state$: BehaviorSubject<T>;
  private readonly _error$ = new Subject<BlocError>();
  state$: Observable<T>;
  onError$: Observable<BlocError>;

  constructor(initialT: T) {
    this._state$ = new BehaviorSubject<T>(Object.freeze(initialT));
    this.state$ = this.select((state) => state).pipe(shareReplay({ refCount: true, bufferSize: 1 }));
    this.onError$ = this._error$.asObservable();
  }

  /**
   * * Getter to retrive the current snapshot of our state directly from the subject
   *  @returns {T}
   */
  protected get state(): T {
    return this._state$.getValue();
  }

  /**
   * * Creates an Observable stream mapped to only a selected part of the state.
   * * The stream will emit data only when the mapped portion has changed.
   * @param mapFn
   * @returns {Observable<K>} Observable<K>
   */
  protected select<K = Partial<T>>(mapCallback: (state: T) => K): Observable<K> {
    return this._state$.asObservable().pipe(
      map((state: T) => mapCallback(state)),
      distinctUntilChanged()
    );
  }

  /**
   * * Push a new immutable state snapshot of our previous state merged with partial new state
   * @param {Partial<T>} newT
   */
  protected emit(newState: T): void {
    this._state$.next(Object.freeze(newState));
  }

  close() {
    this.dispose()
  }

  /**
   * * Dispose the cubit by setting the state to complete, closing the stream
   */
  protected dispose(): void {
    this._state$.complete();
    this._error$.complete();
  }
}
