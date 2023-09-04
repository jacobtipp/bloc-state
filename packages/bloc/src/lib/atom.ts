import { Observable } from 'rxjs';
import { BlocBase } from './base';
import { Change } from './change';
import { Transition } from './transition';
import { ClassType, EventTransformer } from './types';
import { Emitter } from './emitter';

export type AtomBase<State> = {
  name: Readonly<string>;
  close: () => void;
  state$: Observable<State>;
  state: Readonly<State>;
};

export interface AtomBloc<Event, State> extends AtomBase<State> {
  add: (event: Event) => this;
  on: <T extends Event>(
    event: ClassType<T>,
    eventHandler: (
      this: { state: State; name: string },
      event: InstanceType<ClassType<T>>,
      emitter: Emitter<State>
    ) => void | Promise<void>,
    transformer?: EventTransformer<T>
  ) => this;
}

export type AtomBaseProps<State> = {
  name: string;
  onClose?: (this: BlocBase<State>) => void;
  onChange?: (this: BlocBase<State>, change: Change<State>) => void;
  onError?: (this: BlocBase<State>, error: Error) => void;
};

export type Getter = <S>(bloc: AtomBase<S>) => S;

export type Setter<S, A> = (
  emit: (newState: S | ((currentState: S) => S)) => void
) => A & ThisType<{ state: S; name: string } & A>;

export interface AtomCubitProps<State, Actions> extends AtomBaseProps<State> {
  actions?: Setter<State, Actions>;
}

export interface AtomBlocProps<Event, State> extends AtomBaseProps<State> {
  onEvent?: (this: BlocBase<State>, event: Event) => void;
  onTransition?: (
    this: BlocBase<State>,
    transition: Transition<Event, State>
  ) => void;
}

export const stateWatcher = <State>(
  state: State | ((get: Getter) => State)
) => {
  const watched = new Set<Observable<unknown>>();
  return {
    watched,
    add(state$: Observable<unknown>) {
      watched.add(state$);
    },
    clear() {
      watched.clear();
    },
    get size() {
      return watched.size;
    },
    state,
  };
};

export type StateWatcher = ReturnType<typeof stateWatcher>;
