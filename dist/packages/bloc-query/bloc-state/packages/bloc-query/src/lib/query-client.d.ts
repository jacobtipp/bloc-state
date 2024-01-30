import { Observable } from 'rxjs';
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
    /**
     * The map containing the registered queries.
     * @type {Map<string, QueryBloc<any>>}
     * @private
     */
    private queryMap;
    /**
     * Gets the observable for a query or creates a new query if it doesn't exist.
     * @template Data - The type of the data returned by the query.
     * @template Selected - The type of the selected data.
     * @param {GetQueryOptions<Data, Selected>} options - The options for the query.
     * @returns {Observable<Selected>} - An observable for the selected data.
     */
    getQuery: <Data, Selected = QueryState<Data>>(options: GetQueryOptions<Data, Selected>) => Observable<Selected>;
    /**
     * Gets the data for a query.
     * @template Data - The type of the data returned by the query.
     * @param {string | Observable<QueryState<Data>>} keyOrQuery - The key or observable of the query.
     * @returns {Promise<Data>} - A promise that resolves to the query data.
     * @throws {QueryNotFoundException} - If the query does not exist in the QueryClient.
     */
    getQueryData: <Data = unknown>(keyOrQuery: GetQueryData<Data>) => Promise<Data>;
    /**
     * Clears all registered queries and closes them.
     */
    clear: () => void;
    /**
     * Removes a query from the QueryClient.
     * @param {QueryKey} key - The key of the query to be removed.
     * @returns {boolean} - Returns true if the query was successfully removed, false otherwise.
     */
    removeQuery: (key: QueryKey) => boolean;
    private createQuery;
    /**
     * Gets an array of all query keys registered in the QueryClient.
     * @returns {Array<QueryKey>} - An array of query keys.
     */
    getQueryKeys: () => Array<QueryKey>;
    /**
     * Sets new data for a query.
     * @template Data - The type of the data returned by the query.
     * @param {string} queryKey - The key of the query to update.
     * @param {((old: Data) => Data) | Data} set - The new data or a function to update the old data.
     */
    setQueryData: <Data>(queryKey: string, set: Data | ((old: Data) => Data)) => void;
    /**
     * Revalidates all or selected queries.
     * @param {RevalidateQueryOptions} [options] - Options for revalidating queries.
     */
    revalidateQueries: (options?: RevalidateQueryOptions) => void;
    /**
     * Cancels an ongoing fetch operation for a query.
     * @param {string} queryKey - The key of the query to cancel.
     */
    cancelQuery: (queryKey: string) => void;
}
/**
 * Represents an exception thrown when a query is not found in the QueryClient.
 * @extends {Error}
 */
export declare class QueryNotFoundException extends Error {
    /**
     * Creates a new QueryNotFoundException instance.
     * @param {string} message - The error message.
     */
    constructor(message: string);
}
