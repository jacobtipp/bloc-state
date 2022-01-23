import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, concatMap, tap } from "rxjs/operators";
import { Cubit } from "./cubit";
import { asyncGeneratorToObservable } from "./util";

export abstract class Bloc<Event, State> extends Cubit<State> {
  private readonly _events$ = new Subject<Event>();

  private _event: Event | undefined;

  constructor(state: State) {
    super(state);
    this._subscribeToEvents();
  }

  protected get state(): State {
    return this._state;
  }

  addEvent(event: Event): void {
    if (!this._events$.closed) {
      this._events$.next(event);
    }
  }

  protected abstract onTransition(current: State, next: State, event?: Event): void;

  protected abstract onError(error: Error): void;

  protected abstract onEvent(event: Event): void;

  protected transitionHandler(current: State, next: State) {
    this.onTransition(current, next, this._event);
  }

  protected abstract mapEventToState(event: Event): AsyncGenerator<State>;

  private _subscribeToEvents(): void {
    this._events$
      .pipe(
        tap((event) => this.onEvent(event)),
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
    this.onError(error);
    return EMPTY;
  }

  private _dispose(): void {
    this._events$.complete();
    super.dispose();
  }

  close(): void {
    this._dispose();
  }
}
