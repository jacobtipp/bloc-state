import produce, { Draft } from 'immer';
import { StateStatus } from './types';
import { BaseState } from './base-state';

/**
 * Abstract class that represents the state of a BLoC.
 * @template Data The type of the data in the state object.
 */
export abstract class State<Data = any> extends BaseState {
  /**
   * Constructs a new instance of the state object.
   * @param data Initial data for the state object.
   * @param status Initial status for the state object. Defaults to "initial".
   * @param error Initial error for the state object. Defaults to undefined.
   */
  constructor(data: Data, status = 'initial' as const, error?: Error) {
    super();
    this.data = data;
    this.status = status;
    this.error = error;
  }

  /** The current status of the state object. */
  readonly status: StateStatus;

  /** The current error of the state object. */
  readonly error: Error | undefined;

  /** A flag indicating whether the object is an instance of State. */
  readonly isStateInstance = true;

  /** The data in the state object. */
  data: Data;

  /**
   * Produces a new instance of the state object with the specified mutations
   * applied to its data and status.
   * @param status The new status for the state object.
   * @param data Optional callback or value to modify the data in the state object.
   *             Can be a function that produces a draft using Immer, or a new value.
   * @returns A new instance of the state object with the applied mutations.
   */
  private produceWithData(
    status: StateStatus,
    data?: Data | ((data: Draft<Data>) => void)
  ): this {
    if (data == null) {
      return produce(this, (draft) => {
        draft.status = status;
        draft.error = undefined;
      });
    } else if (typeof data === 'function') {
      return produce(this, (draft) => {
        draft.status = status;
        draft.error = undefined;
        draft.data = produce(draft.data, data as (data: Draft<Data>) => void);
      });
    } else {
      return produce(this, (draft) => {
        draft.error = undefined;
        draft.status = status;
        draft.data = produce(draft.data, () => data);
      });
    }
  }

  /**
   * Produces a new instance of the state object with the status set to "loading".
   * @returns A new instance of the state object with the status set to "loading".
   */
  loading(): this {
    return produce(this, (draft) => {
      draft.status = 'loading';
      draft.error = undefined;
    });
  }

  /**
   * Produces a new instance of the state object with the specified mutations
   * applied to its data and status. The status is set to "ready".
   * @param data Optional callback or value to modify the data in the state object.
   *             Can be a function that produces a draft using Immer, or a new value.
   * @returns A new instance of the state object with the applied mutations.
   */
  ready(data?: Data | ((data: Draft<Data>) => void)): this {
    return this.produceWithData('ready', data);
  }

  /**
   * Produces a new instance of the state object with the specified error and
   * status set to "failed".
   * @param error Optional error object to be set in the state object.
   * @returns A new instance of the state object with the specified error and status.
   */
  failed(error?: Error): this {
    return produce(this, (draft) => {
      draft.status = 'failed';
      draft.error = error;
    });
  }
}

/**
 * Type guard function that checks if an object is an instance of State.
 * @param state The object to test.
 * @returns True if the object is an instance of State; otherwise, false.
 */
export const isStateInstance = (state: unknown): state is State => {
  return state instanceof State || Boolean((state as State).isStateInstance);
};
