import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, filter, map, shareReplay, skip, tap } from "rxjs/operators";
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
      tap((newState) => {
        if (newState !== this._state) {
          this.transitionHandler(this._state, newState);
          this._state = newState;
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

  protected onTransition(current: T, next: T) {}
  protected onError(error: Error) {}

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
  protected transitionHandler(current: T, next: T) {
    this.onTransition(current, next);
  }

  /**
   *
   * @param error
   *
   * @override
   * @description
   * * Uncaught Cubit errors will be emitted to an erroHandler of a derived class
   * *
   */
  protected errorHandler(error: Error) {
    this.onError(error);
  }

  /**
   * * Getter to retrieve the current snapshot of the state
   *  @returns {T}
   */
  protected get state(): T {
    return this._state;
  }

  /**
   * * Creates an Observable stream mapped to only a selected part of the state.
   * * The stream will emit data only when the mapped portion has changed. An optional source
   * * stream can be provided as a second parameter as long as it returns <T>.
   * @param mapState
   * @param {Observable<T>} source
   * @returns {Observable<T>} Observable<T>
   */
  protected select(mapState: (state: T) => T, source?: Observable<T>): Observable<T> {
    const stream$ = source || this._state$;
    return stream$.pipe(
      map((state) => mapState(state)),
      distinctUntilChanged()
    );
  }

  /**
   * * Filter any newly emitted state based on filter function criteria
   * @param filterState
   * @returns  {Observable<T>}
   */
  protected filter(filterState: (state: T) => boolean): Observable<T> {
    return this._state$.pipe(
      filter((state) => filterState(state)),
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
