import { EMPTY, Subject, throwError } from "rxjs";
import { catchError, concatMap, mergeMap, tap } from "rxjs/operators";
import { Cubit } from "./cubit";
import { BlocState } from "./state";
import { asyncGeneratorToObservable } from "./util";

export abstract class Bloc<Event, State extends BlocState> extends Cubit<State> {
  constructor(state: State) {
    super(state);
    this._subscribeStateToEvents();
  }

  /**
   * @description
   * * event Subject where events get pushed into the Bloc
   */
  private readonly _events$ = new Subject<Event>();

  /**
   * @description
   * * local event variable
   */
  private _event: Event;

  /**
   * * Returns the current state snapshot from the subject.
   * @returns {State}
   */
  protected get state(): State {
    return super.state;
  }

  /**
   * * Add an Event by pushing an Event object into the stream.
   * @param {Event} event
   */
  addEvent(event: Event): void {
    if (!this._events$.closed) {
      this._events$.next(event);
    }
  }

  /**
   * * Close the bloc stream by calling dispose
   */
  close(): void {
    this._dispose();
  }

  /**
   * * Dispose the bloc by completing all subscribed streams
   */
  private _dispose(): void {
    this._events$.complete();
    super.dispose();
  }

  /**
   * * Map Events to State using an async generator function.
   * @abstract
   * @param {Event} event
   * @yields {State} State
   */
  protected abstract mapEventToState(event: Event): AsyncGenerator<State>;

  /**
   *
   * @param current
   * @param next
   * @param event
   *
   * @override
   * @description
   * * onTransition handler
   */
  protected onTransition(current: State, next: State, event?: Event) {}

  /**
   *
   * @param event
   *
   * @override
   * @description
   * * onEvent handler
   */
  protected onEvent(event: Event) {}

  /**
   *
   * @param error
   *
   * @override
   * @description
   * * onError handler
   */
  protected onError(error: Error) {}

  /**
   *
   * @param current
   * @param next
   *
   * @description
   * * transitionHandler is a method override from parent class
   */
  protected transitionHandler(current: State, next: State) {
    this.onTransition(current, next, this._event);
  }

  /**
   * @description
   * * Subscribe to eventSubject
   */
  private _subscribeStateToEvents(): void {
    this._events$
      .pipe(
        tap((event) => this.onEvent(event)),
        concatMap((event) => this._mapEventToState(event)),
        tap((state) => this.emit(state))
      )
      .subscribe();
  }

  /**
   *
   * @param event
   *
   * @description
   * * convert async generator to an observable and catch any errors
   *
   * @returns {Observable<State>}
   */
  private _mapEventToState(event: Event) {
    return asyncGeneratorToObservable(this.mapEventToState(event)).pipe(
      catchError((error) => this._mapEventToStateError(error)),
      tap(() => (this._event = event)),
      catchError(() => EMPTY)
    );
  }

  /**
   *
   * @param error
   * @returns {Observable<never>}
   */
  private _mapEventToStateError(error: Error) {
    this.onError(error);
    return throwError(() => error);
  }
}
