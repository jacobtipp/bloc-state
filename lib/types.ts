import { Observable } from "rxjs";
import { BlocBase } from "./base";
import { Bloc } from "./bloc";
import { Cubit } from "./cubit";
import { BlocState } from "./state";

export type BlocStateType<T extends BlocBase<any>> = T extends BlocBase<infer U> ? U : never;

export type BlocDataType<D extends BlocState<any>> = D extends BlocState<infer U> ? U : never;

export type BlocStateInstanceType = InstanceType<typeof BlocState>;

export type BlocInstanceType = InstanceType<typeof BlocBase>;

export type BlocType<T extends BlocBase<any>> = T extends Bloc<infer E, infer S>
  ? Bloc<E, S>
  : T extends Cubit<infer S>
  ? Cubit<S>
  : never;

export type StreamType<T extends Observable<any>> = T extends Observable<infer U> ? U : never;

export type EmitUpdaterCallback<T> = (state: T) => T | undefined;

export type Emitter<S> = (state: S | EmitUpdaterCallback<S>) => void;

export type EventHandler<E, S> = (event: E, emitter: Emitter<S>) => void | Promise<void>;

export type EventToStateMapper<E, S> = (event: E) => Observable<S>;

export type StateHandler<S> = (state: S) => void | Promise<void>;

export interface ClassType<T = any> extends Function {
  new (...args: any[]): T;
}

export interface Initial {
  initial: true;
  hasError: false;
  loading: false;
  error: undefined;
  hasData: false;
  data: undefined;
}

export interface InitialWithData<T> {
  initial: true;
  hasError: false;
  loading: false;
  error: undefined;
  message: undefined;
  hasData: true;
  data: T;
}

export interface Ready {
  initial: false;
  hasError: false;
  loading: false;
  error: undefined;
  hasData: false;
  data: undefined;
}

export interface ReadyWithData<T> {
  initial: false;
  hasError: false;
  loading: false;
  error: undefined;
  hasData: true;
  data: T;
}

export interface Loading {
  initial: false;
  hasError: false;
  loading: true;
  error: undefined;
  hasData: false;
  data: undefined;
}

export interface Failed {
  initial: false;
  hasError: false;
  loading: false;
  error: undefined;
  hasData: false;
  data: undefined;
}

export interface FailedWithError<E extends Error> {
  initial: false;
  hasError: true;
  loading: false;
  error: E;
  hasData: false;
  data: undefined;
}

export type StatePayload<T, E extends Error = Error> =
  | Initial
  | InitialWithData<T>
  | Loading
  | Ready
  | ReadyWithData<T>
  | Failed
  | FailedWithError<E>;
