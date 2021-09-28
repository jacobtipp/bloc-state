import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { BlocState } from ".";

export abstract class Cubit<State extends BlocState> {
  private readonly _state$: BehaviorSubject<State>;

  constructor(initialState: State) {
    this._state$ = new BehaviorSubject<State>(initialState);
  }

  /**
   * * Getter to retrive the current snapshot of our state directly from the subject
   *  @returns {State}
   */
  protected get state(): State {
    return this._state$.getValue();
  }

  /**
   * * Creates an Observable stream mapped to only a selected part of the state.
   * * The stream will emit data only when the mapped portion has changed.
   * @param mapFn
   * @returns {Observable<K>} Observable<K>
   */
  protected select<K = Partial<State>>(mapCallback: (state: State) => K): Observable<K> {
    return this._state$.asObservable().pipe(
      map((state: State) => mapCallback(state)),
      distinctUntilChanged()
    );
  }

  /**
   * * Push a new immutable state snapshot of our previous state merged with partial new state
   * @param {Partial<State>} newState
   */
  protected setState(newState: Partial<State>): void {
    this._state$.next({
      ...this.state,
      ...newState,
    });
  }

  /**
   * * Dispose the cubit by setting the state to complete, closing the stream
   */
  protected dispose(): void {
    this._state$.complete();
  }
}
