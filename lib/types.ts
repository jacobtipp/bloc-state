export type EmitUpdaterCallback<T> = (state: T) => T;

export type Emitter<S> = (state: S | EmitUpdaterCallback<S>) => void;

export type EventHandler<E, S> = (event: E, emitter: Emitter<S>) => void | Promise<void>;

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
