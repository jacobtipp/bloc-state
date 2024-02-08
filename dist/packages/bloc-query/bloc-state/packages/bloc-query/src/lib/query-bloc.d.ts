import { Bloc } from '@jacobtipp/bloc';
import { Observable, Subject } from 'rxjs';
import { QueryEvent } from './query-event';
import { FetchTransformerOptions } from './query-fetch-transformer';
import { QueryState, Ready } from './query-state';
/**
 * Represents the unique key used to identify a query. This is typically a string
 * that uniquely identifies the data being fetched or manipulated.
 */
export type QueryKey = string;
/**
 * Defines the configuration options available for a query operation. These options
 * dictate how the query behaves, including its initial state, cache behavior, and
 * error logging.
 *
 * @template Data The type of data expected to be returned by the query function.
 */
export type QueryOptions<Data> = {
    /** Initial data to be used before the query completes. Useful for SSR or initial placeholders. */
    initialData?: Data;
    /** Time in milliseconds after which the data is considered stale and may be refetched. */
    staleTime?: number;
    /** Time in milliseconds to keep the data alive in cache after it becomes inactive. */
    keepAlive?: number;
    /** Whether to log errors to the console. */
    logErrors?: boolean;
    /** A unique key to identify the query. */
    queryKey: QueryKey;
    /** A function returning a promise that resolves with the data. */
    queryFn: (options: QueryFnOptions) => Promise<Data>;
};
/**
 * Extends `QueryOptions` with additional options specific to QueryBloc, which may
 * include options for naming the bloc and configuring stale time at the bloc level.
 *
 * @template Data The type of data expected to be returned by the query function.
 */
export type QueryBlocOptions<Data> = {
    /** Optional name for the bloc. Useful for debugging or identification. */
    name?: string;
    /** Time in milliseconds after which the data in the bloc is considered stale. */
    staleTime?: number;
} & FetchTransformerOptions & QueryOptions<Data>;
/**
 * Options passed to the query function, providing it with an `AbortSignal` to
 * support cancellable fetch operations.
 */
export type QueryFnOptions = {
    /** An AbortSignal to signal the fetch operation can be cancelled. */
    signal: AbortSignal;
};
/**
 * Configuration options for retrieving query data, allowing for the selection
 * of a specific part of the query state and comparison of state for updates.
 *
 * @template Data The type of data managed by the query.
 * @template Selected The type of the selected or derived data from the query state.
 */
export type GetQueryOptions<Data = unknown, Selected = QueryState<Data>> = {
    /** Optional selector function to derive a part of the state. */
    selector?: (state: Ready<Data>) => Selected;
    /** Optional comparator function to determine if the selected state has changed. */
    comparator?: (previous: Selected, current: Selected) => boolean;
} & QueryOptions<Data> & FetchTransformerOptions;
/**
 * Represents a Bloc for handling queries.
 * @template Data - The type of the data returned by the query.
 * @extends {Bloc<QueryEvent, QueryState<Data>>}
 */
export declare class QueryBloc<Data = unknown> extends Bloc<QueryEvent, QueryState<Data>> {
    private options;
    private closeSignal;
    private staleTime;
    private logErrors;
    private handledInitialLoad;
    private revertedState;
    /**
     * Creates a new QueryBloc instance.
     * @param {QueryState<Data>} state - The initial state of the query.
     * @param {QueryBlocOptions<Data>} options - The options for creating the query bloc.
     */
    constructor(state: QueryState<Data>, options: QueryBlocOptions<Data>, closeSignal: Subject<QueryKey>);
    protected onError(error: Error): void;
    private onQueryFetch;
    /**
     * Checks if the query data is stale based on the last update time and stale time.
     * @type {boolean}
     */
    get isStale(): boolean;
    /**
     * Gets an observable for the query state.
     * @template Selected - The type of the selected data.
     * @param {(state: Ready<Data>) => Selected} [selector] - A function to select data from the query state.
     * @param {(previous: Selected, current: Selected) => boolean} [comparer] - A function to compare selected data.
     * @returns {Observable<Selected>} - An observable for the selected data.
     * @throws {QueryClosedException} - If the query is closed.
     */
    getQuery: <Selected = QueryState<Data>>(selector?: ((state: Ready<Data>) => Selected) | undefined, comparer?: ((previous: Selected, current: Selected) => boolean) | undefined) => Observable<Selected>;
    /**
     * Sets new data for the query.
     * @param {((old: Data) => Data) | Data} set - The new data or a function to update the old data.
     */
    setQueryData: (set: Data | ((old: Data) => Data)) => void;
    private subscribers;
    private pendingCloseTimeout;
    /**
     * Returns an observable that provides updates of the query state.
     * This method is used to subscribe to the query's state changes.
     * @returns {Observable<QueryState<Data>>} An Observable that emits updates of the query state.
     */
    listen: () => Observable<QueryState<Data>>;
    /**
     * Cancels the query, aborting the ongoing fetch operation and reverting the state.
     * It emits a 'QueryCancelEvent' and updates the state accordingly.
     */
    cancelQuery: () => void;
    /**
     * Revalidates the query, triggering a new fetch operation if the query is stale or canceled.
     * It emits a 'QueryRevalidateEvent' and updates the state to reflect the fetching status.
     */
    revalidateQuery: () => void;
}
/**
 * Represents an exception thrown when attempting to set query data in an invalid manner.
 * This exception is thrown when the new data for a query cannot be set due to a missing previous data state or other constraints.
 * @extends {Error}
 */
export declare class SetQueryDataException extends Error {
    /**
     * Creates a new SetQueryDataException instance.
     * @param {string} message - The error message.
     */
    name: string;
    constructor(message: string);
}
/**
 * Represents an exception thrown when attempting to interact with a closed query.
 * This exception is thrown when operations are performed on a query that has been closed or is no longer available.
 * @extends {Error}
 */
export declare class QueryClosedException extends Error {
    /**
     * Creates a new QueryClosedException instance.
     * @param {string} message - The error message.
     */
    name: string;
    constructor(message: string);
}
