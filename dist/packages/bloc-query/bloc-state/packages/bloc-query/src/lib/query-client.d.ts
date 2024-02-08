import { Observable, timeout } from 'rxjs';
import { QueryKey, GetQueryOptions } from './query-bloc';
import { Failed, QueryState, Ready } from './query-state';
export type RevalidateQueryOptions = {
    queryKey?: QueryKey;
    predicate?: (queryKey: QueryKey) => boolean;
};
export type GetQueryData<Data> = string | Observable<QueryState<Data>>;
export type ReadyOrFailed<Data> = Ready<Data> | Failed<Data>;
/**
 * Represents a client for managing and interacting with queries.
 */
export declare class QueryClient {
    private _isClosed;
    private _closeSignal$;
    constructor();
    /**
     * Indicates whether the QueryClient is closed.
     * @returns {boolean} - True if the QueryClient is closed, false otherwise.
     */
    get isClosed(): boolean;
    /**
     * The map containing the registered queries.
     * @type {Map<string, QueryBloc<any>>}
     * @private
     */
    private queryMap;
    /**
     * Retrieves an observable for a specified query. If the query does not exist, it creates a new one.
     * @template Data - The type of data returned by the query.
     * @template Selected - The type of the selected data from the query state.
     * @param {GetQueryOptions<Data, Selected>} options - The options for getting or creating the query.
     * @returns {Observable<Selected>} - An observable for the selected data.
     * @throws {QueryClientClosedException} - If the QueryClient is closed.
     */
    getQuery: <Data, Selected = QueryState<Data>>(options: GetQueryOptions<Data, Selected>) => Observable<Selected>;
    /**
     * Retrieves the data for a given query either by its key or an observable.
     * @template Data - The type of the data returned by the query.
     * @param {GetQueryData<Data>} keyOrQuery - The key or the observable of the query.
     * @param {object} [options] - Additional options such as timeout.
     * @returns {Promise<Data>} - A promise resolved with the query data.
     * @throws {QueryNotFoundException} - If the query is not found.
     * @throws {QueryClientClosedException} - If the QueryClient is closed.
     * @throws {QueryCanceledException} - If the query has been canceled.
     * @throws {QueryTimeoutException} - If the query operation exceeds the specified timeout.
     */
    getQueryData: <Data = unknown>(keyOrQuery: GetQueryData<Data>, options?: {
        timeout?: number;
    }) => Promise<Data>;
    /**
     * Clears all registered queries and closes them.
     */
    clear: () => void;
    /**
     * Removes a specified query from the QueryClient.
     * @param {QueryKey} key - The key of the query to be removed.
     * @returns {boolean} - True if the query was successfully removed, false otherwise.
     */
    removeQuery: (key: QueryKey) => boolean;
    private createQuery;
    /**
     * Gets an array of all query keys registered in the QueryClient.
     * @returns {Array<QueryKey>} - An array of query keys.
     */
    getQueryKeys: () => Array<QueryKey>;
    /**
     * Sets new data for a specified query.
     * @template Data - The type of the data returned by the query.
     * @param {string} queryKey - The key of the query to be updated.
     * @param {((old: Data) => Data) | Data} set - The new data or a function to update the old data.
     */
    setQueryData: <Data>(queryKey: string, set: Data | ((old: Data) => Data)) => void;
    /**
     * Revalidates all or selected queries based on the provided options.
     * @param {RevalidateQueryOptions} [options] - Options to specify which queries to revalidate.
     */
    revalidateQueries: (options?: RevalidateQueryOptions) => void;
    /**
     * Cancels an ongoing fetch operation for a specified query.
     * @param {string} queryKey - The key of the query to cancel.
     */
    cancelQuery: (queryKey: string) => void;
    /**
     * Closes the QueryClient, clearing all queries and completing the close signal.
     */
    close: () => void;
}
/**
 * Represents an exception thrown when a query is not found in the QueryClient.
 * This exception is thrown when attempting to access a query that does not exist in the QueryClient's query map.
 * @extends {Error}
 */
export declare class QueryNotFoundException extends Error {
    /**
     * Creates a new QueryNotFoundException instance.
     * @param {string} key - The key of the query that was not found.
     * @param {string} [message='Query ${key} is not found'] - The error message.
     */
    name: string;
    constructor(key: string, message?: string);
}
/**
 * Represents an exception thrown when a query has been canceled.
 * This exception is used to indicate that an operation on a query cannot be completed because the query has been canceled.
 * @extends {Error}
 */
export declare class QueryCanceledException extends Error {
    /**
     * Creates a new QueryCanceledException instance.
     * @param {string} [message='QueryCanceledException: The query has been canceled'] - The error message.
     */
    name: string;
    constructor(message?: string);
}
/**
 * Represents an exception thrown when a query operation times out.
 * This exception is used to signal that a query has not completed in the expected timeframe.
 * @extends {Error}
 */
export declare class QueryTimeoutException extends Error {
    /**
     * Creates a new QueryTimeoutException instance.
     * @param {string} [message='QueryTimeoutException: The query has timed out'] - The error message.
     */
    name: string;
    constructor(message?: string);
}
/**
 * Represents an exception thrown when the QueryClient is closed.
 * This exception is thrown when an operation is attempted on a QueryClient that has been closed.
 * @extends {Error}
 */
export declare class QueryClientClosedException extends Error {
    /**
     * Creates a new QueryClientClosedException instance.
     * @param {string} [message='QueryClient has already been closed'] - The error message.
     */
    name: string;
    constructor(message?: string);
}
