import {
  StateInfo,
  BlocStateInstanceType,
  BlocDataType,
  Initial,
  InitialWithData,
  Ready,
  ReadyWithData,
  Loading,
  Failed,
  FailedWithError,
} from "./types";

export abstract class BlocState<T = unknown> {
  blocStateName = this.constructor.name;
  constructor(public info: StateInfo<T>) {}

  static init<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (info: Initial) => State,
    data?: Data
  ): State;

  static init<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (info: Initial | InitialWithData<Data>) => State,
    data?: Data
  ): State {
    if (data === undefined) {
      return new this({
        initial: true,
        hasError: false,
        error: undefined,
        hasData: false,
        loading: false,
        data: undefined,
      });
    } else {
      return new this({
        initial: true,
        hasError: false,
        error: undefined,
        message: undefined,
        hasData: true,
        loading: false,
        data,
      });
    }
  }

  static ready<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (info: Ready) => State,
    data?: Data
  ): State;

  static ready<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (info: ReadyWithData<Data> | Ready) => State,
    data?: Data
  ): State {
    if (data === undefined) {
      return new this({
        initial: false,
        hasError: false,
        error: undefined,
        hasData: false,
        loading: false,
        data: undefined,
      });
    } else {
      return new this({
        initial: false,
        hasError: false,
        error: undefined,
        hasData: true,
        loading: false,
        data,
      });
    }
  }

  static loading<State extends BlocStateInstanceType>(this: new (info: Loading) => State): State {
    return new this({
      initial: false,
      hasError: false,
      error: undefined,
      hasData: false,
      loading: true,
      data: undefined,
    });
  }

  static failed<State extends BlocStateInstanceType, E extends Error>(
    this: new (info: Failed) => State,
    error?: E
  ): State;

  static failed<State extends BlocStateInstanceType, E extends Error>(
    this: new (info: Failed | FailedWithError<E>) => State,
    error?: E
  ): State {
    if (error !== undefined) {
      return new this({
        initial: false,
        hasError: true,
        error: error,
        hasData: false,
        loading: false,
        data: undefined,
      });
    } else {
      return new this({
        initial: false,
        hasError: false,
        error: undefined,
        hasData: false,
        loading: false,
        data: undefined,
      });
    }
  }
}
