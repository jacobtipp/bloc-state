import {
  StatePayload,
  BlocStateInstanceType,
  BlocDataType,
  Initial,
  InitialWithData,
  Ready,
  ReadyWithData,
  Loading,
  Failed,
  FailedWithError,
  ClassType,
} from "./types";

export abstract class BlocState<T = any> {
  blocStateName = this.constructor.name;
  isBlocStateInstance = true;

  constructor(public payload: StatePayload<T>) {}

  static init<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (payload: Initial) => State,
    data?: Data
  ): State;

  static init<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (payload: Initial | InitialWithData<Data>) => State,
    data?: Data
  ): State {
    if (data === undefined) {
      return new this({
        initial: true,
        hasError: false,
        error: undefined,
        hasData: false,
        loading: false,
        isReady: true,
        data: undefined,
      });
    } else {
      return new this({
        initial: true,
        hasError: false,
        error: undefined,
        message: undefined,
        hasData: true,
        isReady: true,
        loading: false,
        data,
      });
    }
  }

  static ready<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (payload: Ready) => State,
    data?: Data
  ): State;

  static ready<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (payload: ReadyWithData<Data> | Ready) => State,
    data?: Data
  ): State {
    if (data === undefined) {
      return new this({
        initial: false,
        hasError: false,
        error: undefined,
        hasData: false,
        isReady: true,
        loading: false,
        data: undefined,
      });
    } else {
      return new this({
        initial: false,
        hasError: false,
        error: undefined,
        hasData: true,
        isReady: true,
        loading: false,
        data,
      });
    }
  }

  static loading<State extends BlocStateInstanceType>(
    this: new (payload: Loading) => State
  ): State {
    return new this({
      initial: false,
      hasError: false,
      error: undefined,
      hasData: false,
      loading: true,
      isReady: false,
      data: undefined,
    });
  }

  static failed<State extends BlocStateInstanceType, E extends Error>(
    this: new (payload: Failed) => State,
    error?: E
  ): State;

  static failed<State extends BlocStateInstanceType, E extends Error>(
    this: new (payload: Failed | FailedWithError<E>) => State,
    error?: E
  ): State {
    if (error !== undefined) {
      return new this({
        initial: false,
        hasError: true,
        error: error,
        hasData: false,
        isReady: false,
        loading: false,
        data: undefined,
      });
    } else {
      return new this({
        initial: false,
        hasError: false,
        error: undefined,
        isReady: false,
        hasData: false,
        loading: false,
        data: undefined,
      });
    }
  }
}

export const isBlocStateInstance = (state: any): state is BlocState => {
  return state instanceof BlocState || Boolean(state.isBlocStateInstance);
};
