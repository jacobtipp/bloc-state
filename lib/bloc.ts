import { EMPTY, Observable, Subject, throwError } from "rxjs";
import { catchError, concatMap, mergeMap, tap } from "rxjs/operators";
import { Cubit } from "./cubit";
import { BlocState } from "./state";
import { asyncGeneratorToObservable } from "./util";

export abstract class Bloc<Event, State> extends Cubit<State> {
  constructor(state: State) {
    super(state);
    this._subscribeToEvents();
  }

  /**
   * local
   */

  private readonly _events$ = new Subject<Event>();
  private _event: Event | undefined;

  /**
   * public
   */

  addEvent(event: Event): void {
    if (!this._events$.closed) {
      this._events$.next(event);
    }
  }

  close(): void {
    this._dispose();
  }

  /**
   * protected
   */

  protected override onTransition?(current: State, next: State, event?: Event): void;

  protected override onError?(error: Error): void;

  protected onEvent?(event: Event): void;

  protected transitionHandler(current: State, next: State) {
    if (this.onTransition) {
      this.onTransition(current, next, this._event);
    }
  }

  protected abstract mapEventToState(event: Event): AsyncGenerator<State>;

  protected get state(): State {
    return this._state;
  }

  /**
   * private
   */

  private _subscribeToEvents(): void {
    this._events$
      .pipe(
        tap((event) => {
          if (this.onEvent) {
            this.onEvent(event);
          }
        }),
        concatMap((event) => this._mapEventToState(event)),
        tap((state) => this.emit(state))
      )
      .subscribe();
  }

  private _mapEventToState(event: Event): Observable<State> {
    return asyncGeneratorToObservable(this.mapEventToState(event)).pipe(
      catchError((error) => this._mapEventToStateError(error)),
      tap(() => (this._event = event))
    );
  }

  private _mapEventToStateError(error: Error): Observable<never> {
    if (this.onError) {
      this.onError(error);
    }
    return EMPTY;
  }

  private _dispose(): void {
    this._events$.complete();
    super.dispose();
  }
}
