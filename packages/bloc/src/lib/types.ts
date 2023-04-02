export interface ClassType<T> extends Function {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}

export type AbstractClassType<T> = abstract new (...args: any[]) => T;
