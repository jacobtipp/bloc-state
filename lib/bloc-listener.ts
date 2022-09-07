import { Subscription, Observable, merge, concatMap, EMPTY, from } from "rxjs";
import { BlocBase } from "./base";
import { BlocStateType, Type } from "./types";

export abstract class BlocListener<T extends BlocBase<any>> {
  private blocListenerStreamSubscription: Subscription = Subscription.EMPTY;
  private state$: Observable<BlocStateType<T>>;
  private _statesMap = new Map<string, (state: BlocStateType<T>) => void | Promise<void>>();

  constructor(...blocs: T[]) {
    this.state$ = merge.apply(
      this,
      blocs.map((bloc) => bloc.state$)
    );
  }

  protected on<S extends BlocStateType<T>>(state: Type<S>, eventHandler: (state: S) => void) {
    if (this._statesMap.has(state.name)) {
      throw new Error(`Error: ${state.name} can only have one EventHandler`);
    }

    this._statesMap.set(state.name, eventHandler.bind(this));
  }

  listen() {
    this.blocListenerStreamSubscription = this.#subscribeToMergedStates();
  }

  #subscribeToMergedStates() {
    return this.state$.pipe(concatMap(this.#stateHandler.bind(this))).subscribe();
  }

  #stateHandler(state: BlocStateType<T>): Observable<void> {
    const handler = this._statesMap.get(state.blocStateName);
    if (handler === undefined) return EMPTY;
    const result = handler(state);
    return result instanceof Promise ? from(result) : EMPTY;
  }

  close() {
    this.blocListenerStreamSubscription.unsubscribe();
  }
}
