import { Bloc } from '@jacobtipp/bloc';
import { Observable } from 'rxjs';
import { QueryEvent } from './query-event';
import { FetchTransformerOptions } from './query-fetch-transformer';
import { QueryState, Ready } from './query-state';
export type QueryKey = string;
export type QueryOptions<Data> = {
    initialData?: Data;
    staleTime?: number;
    logErrors?: boolean;
    queryKey: QueryKey;
    queryFn: (options: QueryFnOptions) => Promise<Data>;
};
export type QueryBlocOptions<Data> = {
    name?: string;
    staleTime?: number;
} & FetchTransformerOptions & QueryOptions<Data>;
export type QueryFnOptions = {
    signal: AbortSignal;
};
export type GetQueryOptions<Data = unknown, Selected = QueryState<Data>> = {
    selector?: (state: Ready<Data>) => Selected;
    comparator?: (previous: Selected, current: Selected) => boolean;
} & QueryOptions<Data> & FetchTransformerOptions;
/**
 * Represents a Bloc for handling queries.
 * @template Data - The type of the data returned by the query.
 * @extends {Bloc<QueryEvent, QueryState<Data>>}
 */
export declare class QueryBloc<Data = unknown> extends Bloc<QueryEvent, QueryState<Data>> {
    private options;
    private staleTime;
    private logErrors;
    private handledInitialLoad;
    private revertedState;
    /**
     * Creates a new QueryBloc instance.
     * @param {QueryState<Data>} state - The initial state of the query.
     * @param {QueryBlocOptions<Data>} options - The options for creating the query bloc.
     */
    constructor(state: QueryState<Data>, options: QueryBlocOptions<Data>);
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
    /**
     * Cancels the query, aborting the ongoing fetch operation.
     */
    cancelQuery: () => void;
    /**
     * Revalidates the query, triggering a new fetch operation.
     */
    revalidateQuery: () => void;
}
/**
 * Represents an exception thrown when attempting to set query data in an invalid manner.
 * @extends {Error}
 */
export declare class SetQueryDataException extends Error {
    /**
     * Creates a new SetQueryDataException instance.
     * @param {string} message - The error message.
     */
    constructor(message: string);
}
/**
 * Represents an exception thrown when attempting to interact with a closed query.
 * @extends {Error}
 */
export declare class QueryClosedException extends Error {
    /**
     * Creates a new QueryClosedException instance.
     * @param {string} message - The error message.
     */
    constructor(message: string);
}
