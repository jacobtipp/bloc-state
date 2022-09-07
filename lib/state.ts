import { Type } from "./types";

export type BlocStateInstanceType = InstanceType<typeof BlocState>;

export abstract class BlocState<T = unknown> {
  initial: boolean;
  isLoading: boolean;
  message?: string;
  error?: Error;
  data: T;
  hasData: boolean;
  blocStateName = this.constructor.name;

  constructor(data: T, initial: boolean, isLoading: boolean, error?: Error, message?: string) {
    this.initial = initial;
    this.isLoading = isLoading;
    this.error = error;
    this.message = message;
    this.data = data;
    this.hasData = data !== undefined;
  }

  get hasError() {
    return this.error !== undefined;
  }

  get isReady() {
    return !this.initial && !this.hasError && !this.isLoading;
  }

  static init<T extends BlocStateInstanceType, D>(
    this: new (data: D, intial: boolean, isLoading: boolean, error?: Error, message?: string) => T,
    data: D
  ): T {
    return new this(data!, true, false, undefined, undefined);
  }

  static ready<T extends BlocStateInstanceType, D>(
    this: new (data: D, intial: boolean, isLoading: boolean, error?: Error, message?: string) => T,
    data?: D
  ): T {
    return new this(data!, false, false, undefined, undefined);
  }

  static loading<T extends BlocStateInstanceType, D>(
    this: new (data: D, intial: boolean, isLoading: boolean, error?: Error, message?: string) => T,
    message?: string,
    data?: D
  ): T {
    return new this(data!, false, true, undefined, message);
  }

  static failed<T extends BlocStateInstanceType, D>(
    this: new (data: D, intial: boolean, isLoading: boolean, error?: Error, message?: string) => T,
    message: string,
    error: Error,
    data?: D
  ): T {
    return new this(data!, false, false, error, message);
  }

  ofType<K>(classType: Type<K>): boolean {
    return this instanceof classType;
  }
}
