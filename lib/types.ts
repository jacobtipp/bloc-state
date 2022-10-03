import { Observable } from "rxjs";
import { BlocBase } from "./base";
import { Bloc } from "./bloc";
import { Cubit } from "./cubit";
import { BlocEvent } from "./event";
import { BlocState } from "./state";

export type BlocStateInstanceType = InstanceType<typeof BlocState>;

export interface BlocEmitter<State> {
  onEach<T>(
    stream$: Observable<T>,
    onData: (data: T) => void,
    onError?: (error: Error) => void
  ): Promise<void>;

  forEach<T>(
    stream$: Observable<T>,
    onData: (data: T) => State,
    onError?: (error: Error) => State
  ): Promise<void>;
}

export type EmitUpdaterCallback<T> = (state: T) => T;

export type EmitDataUpdaterCallback<T extends BlocState<any>> = (data: BlocDataType<T>) => T;

export interface Emitter<S extends BlocState> extends BlocEmitter<S> {
  (state: S | EmitDataUpdaterCallback<S>): void;
  close: () => void;
}

export type EventHandler<E extends BlocEvent, S extends BlocState> = (
  event: InstanceType<ClassType<E>>,
  emitter: Emitter<S>
) => void | Promise<void>;

export interface ClassType<T = any> extends Function {
  new (...args: any[]): T;
}

export type BlocStateType<T extends BlocBase<any>> = T extends Cubit<infer U>
  ? U
  : T extends Bloc<any, infer D>
  ? D
  : never;

export type BlocDataType<T> = T extends BlocState<infer U> ? U : T;

export type CubitSelectorConfig<State, P> = {
  selector: (state: State) => P;
  filter?: (state: P) => boolean;
};

export type BlocSelectorConfig<State extends BlocState<any>, P> = {
  selector: (state: BlocDataType<State>) => P;
  filter?: (state: P) => boolean;
};

export type EventMapper<Event extends BlocEvent> = (event: Event) => Observable<void>;

export type EventTransformer<Event extends BlocEvent> = (
  events$: Observable<Event>,
  mapper: EventMapper<Event>
) => Observable<void>;

export interface InitialWithData<T> {
  initial: true;
  hasError: false;
  loading: false;
  error: undefined;
  hasData: true;
  isReady: true;
  data: T;
  isFailure: false;
}

export interface ReadyWithData<T> {
  initial: false;
  hasError: false;
  loading: false;
  error: undefined;
  isReady: true;
  hasData: true;
  data: T;
  isFailure: false;
}

export interface Loading {
  initial: false;
  hasError: false;
  loading: true;
  error: undefined;
  isReady: false;
  hasData: false;
  data: undefined;
  isFailure: false;
}

export interface LoadingWithData<T> {
  initial: false;
  hasError: false;
  loading: true;
  error: undefined;
  isReady: false;
  hasData: true;
  data: T;
  isFailure: false;
}

export interface Failed {
  initial: false;
  hasError: false;
  loading: false;
  error: undefined;
  isReady: false;
  hasData: false;
  data: undefined;
  isFailure: true;
}

export interface FailedWithError<E extends Error> {
  initial: false;
  hasError: true;
  loading: false;
  error: E;
  hasData: false;
  isReady: false;
  data: undefined;
  isFailure: true;
}

export type StatePayload<T, E extends Error = Error> =
  | InitialWithData<T>
  | Loading
  | ReadyWithData<T>
  | Failed
  | FailedWithError<E>;
