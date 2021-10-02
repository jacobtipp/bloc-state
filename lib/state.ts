import { BlocError, InvalidConstructorArgumentsError } from "./error";

/**
 * @description
 * * BlocState is abstract but it's factory methods are static
 */
export type BlocStateConstructorArguments<T> = {
  data?: T;
  initial?: boolean;
  loading?: boolean;
  ready?: boolean;
  message?: string;
  error?: BlocError;
};

export abstract class BlocState<T = any> {
  data: T;
  initial: boolean;
  isLoading: boolean;
  message: string;
  error?: BlocError;

  /**
   * @description use static factory methods to create instances.
   * @example
   * ! Don't do this -> new BlocState()
   * * Do this -> BlocState.initialize(T)
   *
   * @param {BlocStateConstructorArguments<T>} args
   */
  constructor(args: BlocStateConstructorArguments<T>) {
    this._mapConstructorToState(args);
  }

  get hasData() {
    return this.data !== undefined;
  }

  get hasError() {
    return this.error !== undefined;
  }

  get isReady() {
    return !this.initial && !this.hasError && !this.isLoading;
  }

  /**
   * * These are the static methods to create new instances of our state.
   * * There are only 4 different states a BlocState can be in
   * * {initialize, ready, loading, failed}
   *
   */

  static initialize<D, T extends InstanceType<typeof BlocState>>(
    this: new (args: BlocStateConstructorArguments<D>) => T,
    data: D
  ): T {
    return new this({ initial: true, data: data });
  }

  static ready<D, T extends InstanceType<typeof BlocState>>(
    this: new (args: BlocStateConstructorArguments<D>) => T,
    data?: D
  ): T {
    return new this({ data, ready: true });
  }

  static loading<D, T extends InstanceType<typeof BlocState>>(
    this: new (args: BlocStateConstructorArguments<D>) => T,
    message = ""
  ): T {
    return new this({ message, loading: true });
  }

  static failed<D, T extends InstanceType<typeof BlocState>>(
    this: new (args: BlocStateConstructorArguments<D>) => T,
    message: string,
    error: BlocError
  ): T {
    return new this({ error, message });
  }

  private _mapConstructorToState(args?: BlocStateConstructorArguments<T>) {
    if (args?.initial) {
      this._initialize(args.data);
    } else if (args?.ready) {
      this._ready(args.data);
    } else if (args?.error) {
      this._failed(args.message, args.error);
    } else if (args?.loading) {
      this._loading(args.message);
    } else {
      throw new InvalidConstructorArgumentsError();
    }
  }

  private _initialize(data?: T) {
    if (data !== undefined) {
      this.data = data;
    }
    this.initial = true;
    this.isLoading = false;
    this.message = "";
    this.error = undefined;
  }

  private _ready(data?: T) {
    if (data !== undefined) {
      this.data = data;
    }
    this.initial = false;
    this.isLoading = false;
    this.message = "";
    this.error = undefined;
  }

  private _loading(message = "") {
    this.initial = false;
    this.isLoading = true;
    this.message = message;
    this.error = undefined;
  }

  private _failed(message = "", error: BlocError) {
    this.initial = false;
    this.isLoading = false;
    this.message = message;
    this.error = error;
  }
}
