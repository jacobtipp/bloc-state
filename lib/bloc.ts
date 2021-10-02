import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, mergeMap, tap } from "rxjs/operators";
import { Cubit } from "./cubit";
import { BlocState } from "./state";
import { asyncGeneratorToObservable } from "./util";

export interface Transition {
  event: Event;
  previous: BlocState;
  next: BlocState;
}

export abstract class Bloc<E, State extends BlocState> extends Cubit<State> {
  private readonly _events$ = new Subject<E>();
  private readonly _transition$ = new Subject<Transition>();

  public onEvent$: Observable<E>;
  public onTransition: Observable<Transition>;

  constructor(state: State) {
    super(state);
    this.onEvent$ = this._events$.asObservable();
    this.onTransition = this._transition$.asObservable();
    this._subscribeStateoEvents();
  }

  /**
   * * Returns the current state snapshot from the subject.
   * @returns {State}
   */
  protected get state(): State {
    return this.state;
  }

  /**
   * * Add a Event by pushing an Event object into the stream.
   * @param {Event} event
   */
  addEvent(event: E): void {
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
    this._transition$.complete();
    super.dispose();
  }

  /**
   * * Map Events to State using an async generator function.
   * @abstract
   * @param {Event} event
   * @yields {State} State
   */
  abstract mapEventToState(event: E): AsyncGenerator<State>;

  /**
   * @access private
   * * Subscribe to Events stream
   */
  private _subscribeStateoEvents(): void {
    this._events$
      .pipe(
        mergeMap((e) => asyncGeneratorToObservable(this.mapEventToState(e))),
        tap((state) => this.emit(state)),
        catchError((error) => this._handleError(error))
      )
      .subscribe();
  }

  private _handleError(error: Error) {
    return EMPTY;
  }
}
