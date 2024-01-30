import { EventTransformer } from '@jacobtipp/bloc';
import { QueryBloc, QueryFetchEvent } from '.';
export type RetryOptions = {
    maxRetryAttempts?: number;
    scalingDuration?: number;
    retryDuration?: number;
};
export type FetchTransformerOptions = {
    retryWhen?: (error: unknown, attemptCount: number) => RetryOptions | undefined;
} & RetryOptions;
/**
 * A function that transforms a `QueryFetchEvent` stream, handling retries and aborting fetch operations.
 * @template Data - The type of data returned by the query.
 * @param {FetchOptions} options - Options for configuring fetch behavior, including retry options.
 * @param {QueryBloc<Data>} bloc - The query bloc associated with the fetch operation.
 * @returns {EventTransformer<QueryFetchEvent>} - A function that transforms the `QueryFetchEvent` stream.
 */
export declare const queryFetchTransformer: <Data>(options: FetchTransformerOptions, bloc: QueryBloc<Data>) => EventTransformer<QueryFetchEvent>;
