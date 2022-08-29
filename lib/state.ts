import { Type } from "./types";

export type BlocStateInstanceType = InstanceType<typeof BlocState>;

export abstract class BlocState<T = any> {
  initial: boolean;
  isLoading: boolean;
  message?: string;
  error?: Error;
  data?: T;
  hasData: boolean;

  constructor(initial: boolean, isLoading: boolean, error?: Error, message?: string, data?: T) {
    this.initial = initial;
    this.isLoading = isLoading;
    this.error = error;
    this.message = message;
    this.data = data;
    this.hasData = data ? true : false;
  }

  get hasError() {
    return this.error !== undefined;
  }

  get isReady() {
    return !this.initial && !this.hasError && !this.isLoading;
  }

  static init<T extends BlocStateInstanceType, D>(
    this: new (intial: boolean, isLoading: boolean, error?: Error, message?: string, data?: D) => T,
    data?: D
  ): T {
    return new this(true, false, undefined, undefined, data);
  }

  static ready<T extends BlocStateInstanceType, D>(
    this: new (intial: boolean, isLoading: boolean, error?: Error, message?: string, data?: D) => T,
    data?: D
  ): T {
    return new this(false, false, undefined, undefined, data);
  }

  static loading<T extends BlocStateInstanceType, D>(
    this: new (intial: boolean, isLoading: boolean, error?: Error, message?: string, data?: D) => T,
    message?: string
  ): T {
    return new this(false, true, undefined, message, undefined);
  }

  static failed<T extends BlocStateInstanceType, D>(
    this: new (intial: boolean, isLoading: boolean, error?: Error, message?: string, data?: D) => T,
    message: string,
    error: Error
  ): T {
    return new this(false, false, error, message, undefined);
  }

  ofType<K>(classType: Type<K>): boolean {
    return this instanceof classType;
  }
}
