import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, concatMap, tap } from "rxjs/operators";
import { Cubit } from "./cubit";
import { asyncGeneratorToObservable } from "./util";

export abstract class Bloc<TEvent, TState> extends Cubit<TState> {
  private readonly _events$ = new Subject<TEvent>();

  private _event: TEvent | undefined;

  constructor(state: TState) {
    super(state);
    this._subscribeToEvents();
  }

  protected get state(): TState {
    return this._state;
  }

  addEvent(event: TEvent): void {
    if (!this._events$.closed) {
      this._events$.next(event);
    }
  }

  protected abstract onTransition(current: TState, next: TState, event?: TEvent): void;

  protected abstract onError(error: Error): void;

  protected abstract onEvent(event: TEvent): void;

  protected transitionHandler(current: TState, next: TState) {
    this.onTransition(current, next, this._event);
  }

  protected abstract mapEventToState(event: TEvent): AsyncGenerator<TState>;

  private _subscribeToEvents(): void {
    this._events$
      .pipe(
        tap((event) => this.onEvent(event)),
        concatMap((event) => this._mapEventToState(event)),
        tap((state) => this.emit(state))
      )
      .subscribe();
  }

  private _mapEventToState(event: TEvent): Observable<TState> {
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
