import { Draft } from 'immer';
import { StateStatus } from './types';
import { BaseState } from './base-state';
/**
 * Abstract class that represents the state of a BLoC.
 * @template Data The type of the data in the state object.
 */
export declare abstract class State<Data = any> extends BaseState {
    /**
     * Constructs a new instance of the state object.
     * @param data Initial data for the state object.
     * @param status Initial status for the state object. Defaults to "initial".
     * @param error Initial error for the state object. Defaults to undefined.
     */
    constructor(data: Data, status?: StateStatus, error?: Error);
    /** The current status of the state object. */
    readonly status: StateStatus;
    /** The current error of the state object. */
    readonly error: Error | undefined;
    /** A flag indicating whether the object is an instance of State. */
    readonly isStateInstance = true;
    /** The data in the state object. */
    readonly data: Data;
    /**
     * Produces a new instance of the state object with the specified mutations
     * applied to its data and status.
     * @param status The new status for the state object.
     * @param data Optional callback or value to modify the data in the state object.
     *             Can be a function that produces a draft using Immer, or a new value.
     * @returns A new instance of the state object with the applied mutations.
     */
    private produceWithData;
    /**
     * Produces a new instance of the state object with the status set to "loading".
     * Optionally allows modification of the state's data.
     * @param data Optional callback or value to modify the data in the state object.
     *             Can be a function that produces a draft using Immer, or a new value.
     * @returns A new instance of the state object with the status set to "loading".
     */
    loading(data?: Data | ((data: Draft<Data>) => void)): this;
    /**
     * Produces a new instance of the state object with the specified mutations
     * applied to its data and status. The status is set to "ready".
     * @param data Optional callback or value to modify the data in the state object.
     *             Can be a function that produces a draft using Immer, or a new value.
     * @returns A new instance of the state object with the applied mutations.
     */
    ready(data?: Data | ((data: Draft<Data>) => void)): this;
    /**
     * Produces a new instance of the state object with the specified error and
     * status set to "failed".
     * @param error Optional error object to be set in the state object.
     * @returns A new instance of the state object with the specified error and status.
     */
    failed(error?: Error): this;
}
/**
 * Type guard function that checks if an object is an instance of State.
 * @param state The object to test.
 * @returns True if the object is an instance of State; otherwise, false.
 */
export declare const isStateInstance: (state: unknown) => state is State<any>;
