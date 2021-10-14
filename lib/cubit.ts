import { isEqual } from "lodash";
import { BehaviorSubject, Observable } from "rxjs";
import { shareReplay, skip, tap } from "rxjs/operators";
import { distinctUntilChanged, map } from "rxjs/operators";
import { BlocState } from ".";

export abstract class Cubit<T extends BlocState> {
  constructor(private _state: T) {
    this._stateSubject$ = new BehaviorSubject(_state);
    this._state$ = this._buildStatePipeline();
    this.state$ = this.select((state) => state);
    this._listen();
  }

  /** 
   * @description
   * * public state observable
   */
  state$: Observable<T>;

  /** 
   * @description
   * * private _state observable used to build a pipeline for stateSubject
   */
  private readonly _state$: Observable<T>;

  /** 
   * @description
   * * the BehaviorSubject of a Cubit
   */
  private readonly _stateSubject$: BehaviorSubject<T>;

  /**
   * @description 
   * * State that is pushed to a Cubit passes through this pipeline
   * 
   * @returns {Observable<T>}
   */
  private _buildStatePipeline(): Observable<T> {
    return this._stateSubject$.asObservable().pipe(
      distinctUntilChanged(),
      tap((state) => {
        if (state !== this._state) {
          this.transitionHandler(this._state, state);
          this._state = state
        }
      }),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  /**
   * @description
   * * subscribe to stateSubject when a Cubit is instantiated
   */
  private _listen() {
    this._state$.subscribe({
      error: (error) => this.errorHandler(error),
    });
  }

  /**
   * 
   * @param current: T
   * @param next: T
   * 
   * @override
   * @description
   * * before the next state is emitted, provide a transition handler function that a
   * * derived class can implement
   */
  protected transitionHandler(current: T, next: T) {}

  /**
   * 
   * @param error 
   * 
   * @override
   * @description
   * * Uncaught Cubit errors will be emitted to an erroHandler of a derived class
   * * 
   */
  protected errorHandler(error: Error) {}

  /**
   * * Getter to retrieve the current snapshot of the state
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
      distinctUntilChanged()
    );
  }

  /**
   * * Push a new immutable state snapshot
   * @param {T} newState
   */
  protected emit(newState: T): void {
    if (!this._stateSubject$.closed) {
      const frozen = Object.freeze(newState);
      this._stateSubject$.next(frozen);
    }
  }

  /**
   * * Dispose the cubit by setting the state to complete, closing the stream
   */
  protected dispose(): void {
    this._stateSubject$.complete();
  }

  /**
   * @description
   * * close Bloc, 
   */
  close() {
    this.dispose();
  }

}
