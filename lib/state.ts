import {
  StatePayload,
  BlocStateInstanceType,
  BlocDataType,
  InitialWithData,
  ReadyWithData,
  Loading,
  Failed,
  FailedWithError,
  LoadingWithData,
} from "./types";

export abstract class BlocState<T = any> {
  readonly blocStateName = this.constructor.name;
  readonly isBlocStateInstance = true;

  constructor(public payload: StatePayload<T>) {}

  static init<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (payload: InitialWithData<Data>) => State,
    data: Data
  ): State {
    return new this({
      initial: true,
      hasError: false,
      isFailure: false,
      error: undefined,
      isReady: true,
      loading: false,
      hasData: true,
      data,
    });
  }

  static ready<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (payload: ReadyWithData<Data>) => State,
    data: Data
  ): State {
    return new this({
      initial: false,
      hasError: false,
      isFailure: false,
      error: undefined,
      isReady: true,
      loading: false,
      hasData: true,
      data,
    });
  }

  static loading<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (payload: Loading) => State,
    data?: Data
  ): State;

  static loading<State extends BlocStateInstanceType, Data extends BlocDataType<State>>(
    this: new (payload: Loading | LoadingWithData<Data>) => State,
    data?: Data
  ): State {
    if (data !== undefined) {
      return new this({
        initial: false,
        hasError: false,
        error: undefined,
        hasData: true,
        loading: true,
        isReady: false,
        data: data,
        isFailure: false,
      });
    } else {
      return new this({
        initial: false,
        hasError: false,
        error: undefined,
        hasData: false,
        loading: true,
        isReady: false,
        data: undefined,
        isFailure: false,
      });
    }
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
        isFailure: true,
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
        isFailure: true,
      });
    }
  }
}

export const isBlocStateInstance = (state: any): state is BlocState => {
  return state instanceof BlocState || Boolean(state.isBlocStateInstance);
};
