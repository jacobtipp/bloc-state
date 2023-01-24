import {
  EMPTY,
  from,
  Observable,
  Subject,
  Subscription,
  catchError,
  filter,
  mergeMap,
} from "rxjs"
import { BlocBase } from "./base"
import { BlocObserver } from "./bloc-observer"
import { BlocEvent } from "./event"
import { Transition } from "./transition"
import {
  EventHandler,
  ClassType,
  EventTransformer,
  Emitter,
  EmitUpdaterCallback,
  BlocBaseConfig,
} from "./types"

export abstract class Bloc<
  Event extends BlocEvent,
  State,
> extends BlocBase<State> {
  constructor(state: State, config?: BlocBaseConfig) {
    super(state, config)
    this.on = this.on.bind(this)
    this.add = this.add.bind(this)
    this.emit = this.emit.bind(this)
  }

  private readonly _eventSubject$ = new Subject<Event>()
  private readonly _eventMap = new Map<ClassType<Event>, null>()
  private readonly _subscriptions = new Set<Subscription>()
  private readonly _emitters = new Set<Emitter<State>>()
  readonly isBlocInstance = true

  private _mapEventToStateError(error: Error): Observable<never> {
    this.onError(error)
    return EMPTY
  }

  protected override onError(error: Error): void {
    Bloc.observer.onError(this, error)
  }

  protected onTransition(transition: Transition<Event, State>): void {
    Bloc.observer.onTransition(this, transition)
  }

  protected onEvent(event: Event): void {
    Bloc.observer.onEvent(this, event)
  }

  protected on<T extends Event>(
    event: ClassType<T>,
    eventHandler: EventHandler<T, State>,
    transformer: EventTransformer<T> = Bloc.transformer,
  ): void {
    if (this._eventMap.has(event)) {
      throw new Error(`${event.name} can only have one EventHandler`)
    }

    this._eventMap.set(event, null)

    const mapEventToState = (event: T): Observable<void> => {
      const stateToBeEmittedStream$ = new Subject<State>()
      let disposables: Subscription[] = []
      let isClosed = false

      const emitter: Emitter<State> = (
        nextState: State | EmitUpdaterCallback<State>,
      ): void => {
        if (isClosed) {
          return
        }

        let stateToBeEmitted: State

        if (typeof nextState === "function") {
          const callback = nextState as EmitUpdaterCallback<State>
          stateToBeEmitted = callback(this.state)
        } else {
          stateToBeEmitted = nextState
        }

        if (this.state !== stateToBeEmitted) {
          try {
            this.onTransition(
              new Transition(this.state, event, stateToBeEmitted),
            )
            stateToBeEmittedStream$.next(stateToBeEmitted)
          } catch (error) {
            if (error instanceof Error) this.onError(error)
          }
        }
      }

      emitter.onEach = (stream$, onData, onError) =>
        new Promise((resolve) => {
          const subscription = stream$.subscribe({
            next: onData,
            error: (error) => {
              if (onError != null && error != null) {
                onError(error)
              }
              resolve()
            },
            complete: () => {
              resolve()
            },
          })

          disposables.push(subscription)
        })

      emitter.forEach = (stream$, onData, onError) =>
        emitter.onEach(
          stream$,
          (data) => emitter(onData(data)),
          onError ? (error: unknown) => emitter(onError(error as Error)) : undefined,
        )

      emitter.close = () => {
        isClosed = true
        stateToBeEmittedStream$.complete()
        for (const sub of disposables) {
          sub.unsubscribe()
        }
        disposables = []
        this._emitters.delete(emitter)
      }

      this._emitters.add(emitter)

      return new Observable((subscriber) => {
        stateToBeEmittedStream$.subscribe({
          next: (nextState) => {
            this.emit(nextState)
          },
        })

        const result = eventHandler.call(this, event, emitter)

        if (result instanceof Promise) {
          from(result).subscribe({
            complete: () => subscriber.complete(),
          })
        } else {
          subscriber.complete()
        }

        return () => {
          emitter.close()
        }
      })
    }

    const transformStream$ = transformer(
      this._eventSubject$.pipe(
        filter((newEvent): newEvent is T => newEvent instanceof event),
      ),
      mapEventToState,
    )

    const subscription = transformStream$
      .pipe(catchError((error: Error) => this._mapEventToStateError(error)))
      .subscribe()

    this._subscriptions.add(subscription)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static transformer: EventTransformer<any> = (events$, mapper) =>
    events$.pipe(mergeMap(mapper))

  static observer: BlocObserver = new BlocObserver()

  add(event: Event) {
    if (!this._eventSubject$.closed) {
      try {
        this.onEvent(event)
        this._eventSubject$.next(event)
      } catch (error) {
        if (error instanceof Error) this.onError(error)
      }
    }
    return this
  }

  override close(): void {
    this._emitters.forEach((emitter) => emitter.close())
    this._subscriptions.forEach((subscription) => subscription.unsubscribe())
    this._emitters.clear()
    this._subscriptions.clear()
    super.close()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isBlocInstance = (bloc: any): bloc is Bloc<any, any> => {
  return bloc instanceof Bloc || Boolean(bloc.isBlocInstance)
}
