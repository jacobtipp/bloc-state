import { EMPTY, Observable, Subject, throwError } from "rxjs";
import { catchError, concatMap, mergeMap, tap } from "rxjs/operators";
import { Cubit } from "./cubit";
import { BlocTState } from "./state";
import { asyncGeneratorToObservable } from "./util";

export abstract class Bloc<TEvent, TState> extends Cubit<TState> {
  private readonly _events$ = new Subject<TEvent>();

  private _event: TEvent | undefined;

  constructor(state: TState) {
    super(state);
    this._subscribeToTEvents();
  }

  protected get state(): TState {
    return this._state;
  }

  addTEvent(event: TEvent): void {
    if (!this._events$.closed) {
      this._events$.next(event);
    }
  }

  protected override onTransition?(current: TState, next: TState, event?: TEvent): void;

  protected override onError?(error: Error): void;

  protected onTEvent?(event: TEvent): void;

  protected transitionHandler(current: TState, next: TState) {
    if (this.onTransition) {
      this.onTransition(current, next, this._event);
    }
  }

  protected abstract mapTEventToTState(event: TEvent): AsyncGenerator<TState>;

  private _subscribeToTEvents(): void {
    this._events$
      .pipe(
        tap((event) => {
          if (this.onTEvent) {
            this.onTEvent(event);
          }
        }),
        concatMap((event) => this._mapTEventToTState(event)),
        tap((state) => this.emit(state))
      )
      .subscribe();
  }

  private _mapTEventToTState(event: TEvent): Observable<TState> {
    return asyncGeneratorToObservable(this.mapTEventToTState(event)).pipe(
      catchError((error) => this._mapTEventToTStateError(error)),
      tap(() => (this._event = event))
    );
  }

  private _mapTEventToTStateError(error: Error): Observable<never> {
    if (this.onError) {
      this.onError(error);
    }
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
