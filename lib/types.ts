import { Observable } from "rxjs";
import { BlocBase } from "./base";
import { Bloc } from "./bloc";
import { Cubit } from "./cubit";

export type BlocStateType<T extends BlocBase<any>> = T extends BlocBase<infer U> ? U : never;

export type BlocType<T extends BlocBase<any>> = T extends Bloc<infer E, infer S>
  ? Bloc<E, S>
  : T extends Cubit<infer S>
  ? Cubit<S>
  : never;

export type EmitUpdaterCallback<T> = (state: T) => T;

export type Emitter<S> = (state: S | EmitUpdaterCallback<S>) => void;

export type EventHandler<E, S> = (event: E, emitter: Emitter<S>) => void | Promise<void>;

export type EventToStateMapper<E, S> = (event: E) => Observable<S>;

export type StateHandler<S> = (state: S) => void | Promise<void>;

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
