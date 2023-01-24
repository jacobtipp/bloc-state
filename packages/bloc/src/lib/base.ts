import { Observable, Subscription, BehaviorSubject, shareReplay } from "rxjs"
import { Bloc } from "./bloc"
import { Change } from "./change"
import { BlocBaseConfig, EmitUpdaterCallback } from "./types"

export abstract class BlocBase<State = unknown> {
  constructor(state: State, config?: BlocBaseConfig) {
    this._state = state
    this.blocName = config?.name ?? this.constructor.name
    this.emit = this.emit.bind(this)
    this._stateSubject$ = new BehaviorSubject(state)
    this.state$ = this._buildStatePipeline()
    this._stateSubscription = this._subscribeStateoState()
    this.onCreate()
  }

  private _isClosed = false
  private _state: State
  private readonly _stateSubject$: BehaviorSubject<State>
  private readonly _stateSubscription: Subscription

  private _subscribeStateoState(): Subscription {
    return this.state$.subscribe()
  }

  private _buildStatePipeline(): Observable<State> {
    return this._stateSubject$
      .asObservable()
      .pipe(shareReplay({ refCount: true, bufferSize: 1 }))
  }

  private _handleNewState(newState: State | EmitUpdaterCallback<State>): State {
    let stateToBeEmitted: State

    if (typeof newState === "function") {
      const callback = newState as EmitUpdaterCallback<State>
      stateToBeEmitted = callback(this.state)
    } else {
      stateToBeEmitted = newState
    }

    return stateToBeEmitted
  }

  protected onCreate() {
    Bloc.observer.onCreate(this)
  }

  protected onError(error: Error): void {
    Bloc.observer.onError(this, error)
  }

  protected onChange(change: Change<State>): void {
    Bloc.observer.onChange(this, change)
  }

  protected onClose() {
    Bloc.observer.onClose(this)
  }

  readonly state$: Observable<State>

  get state(): State {
    return this._state
  }

  get isClosed() {
    return this._isClosed
  }

  emit(newState: State | EmitUpdaterCallback<State>): void {
    if (!this._stateSubject$.closed) {
      try {
        const stateToBeEmitted = this._handleNewState(newState)
        if (this._state !== stateToBeEmitted) {
          this.onChange(new Change(this.state, stateToBeEmitted))
          this._state = stateToBeEmitted
          this._stateSubject$.next(stateToBeEmitted)
        }
      } catch (error) {
        if (error instanceof Error) this.onError(error)
      }
    }
  }

  readonly blocName: string

  close() {
    this._isClosed = true
    this._stateSubject$.complete()
    this._stateSubscription.unsubscribe()
    this.onClose()
  }
}
