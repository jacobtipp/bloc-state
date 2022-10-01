import {
  BehaviorSubject,
  Observable,
  Subscription,
  distinctUntilChanged,
  shareReplay,
  map,
  filter,
  EMPTY,
} from "rxjs";
import { Bloc } from ".";
import { Change } from "./change";
import { CubitSelectorConfig, EmitUpdaterCallback } from "./types";

export abstract class BlocBase<State = any> {
  constructor(state: State) {
    this.#state = state;
    this.emit = this.emit.bind(this);
    this.#stateSubject$ = new BehaviorSubject(state);
    this.state$ = this.#buildStatePipeline();
    this.#stateSubscription = this.#subscribeStateoState();
  }

  #state: State;

  readonly #stateSubject$: BehaviorSubject<State>;

  readonly #stateSubscription: Subscription;

  #subscribeStateoState(): Subscription {
    return this.state$.subscribe();
  }

  #buildStatePipeline(): Observable<State> {
    return this.#stateSubject$
      .asObservable()
      .pipe(distinctUntilChanged(), shareReplay({ refCount: true, bufferSize: 1 }));
  }

  #handleNewState(newState: State | EmitUpdaterCallback<State>): State | undefined {
    let stateToBeEmitted: State | undefined;

    if (typeof newState === "function") {
      try {
        let callback = newState as EmitUpdaterCallback<State>;
        stateToBeEmitted = callback(this.state);
      } catch (error) {
        this.onError(error);
      }
    } else {
      stateToBeEmitted = newState;
    }

    return stateToBeEmitted;
  }

  protected onError(error: Error): void {
    Bloc.observer.onError(this, error);
  }

  protected onChange(change: Change<State>): void {
    Bloc.observer.onChange(this, change);
  }

  readonly state$: Observable<State>;

  get state(): State {
    return this.#state;
  }

  emit(newState: State | EmitUpdaterCallback<State>): void {
    if (!this.#stateSubject$.closed) {
      const stateToBeEmitted = this.#handleNewState(newState);

      if (stateToBeEmitted !== undefined && this.#state !== stateToBeEmitted) {
        try {
          this.onChange(new Change(this.state, stateToBeEmitted));
          this.#state = stateToBeEmitted;
          this.#stateSubject$.next(stateToBeEmitted);
        } catch (error) {
          this.onError(error);
        }
      }
    }
  }

  select<K>(config: CubitSelectorConfig<State, K> | ((state: State) => K)): Observable<K> {
    let stream$: Observable<K> = EMPTY;

    if ("selector" in config) {
      stream$ = this.state$.pipe(map(config.selector), filter(config.filter ?? (() => true)));
    } else if (typeof config === "function") {
      stream$ = this.state$.pipe(map(config));
    }

    return stream$.pipe(distinctUntilChanged(), shareReplay({ refCount: true, bufferSize: 1 }));
  }

  close() {
    this.#stateSubject$.complete();
    this.#stateSubscription.unsubscribe();
  }
}
