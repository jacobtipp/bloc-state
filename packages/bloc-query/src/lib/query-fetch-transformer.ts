import { switchMap, Observable, EMPTY, timer, retry } from 'rxjs';
import { BlocObserver, EventTransformer, Transition } from '@jacobtipp/bloc';
import { Failed, QueryBloc, QueryErrorEvent, QueryFetchEvent } from '.';

/**
 * Configuration options for controlling retry behavior in fetch operations. These
 * options specify how and when fetch attempts should be retried upon failure.
 */
export type RetryOptions = {
  /**
   * The maximum number of retry attempts to make before giving up. If not specified,
   * retries may not be performed.
   */
  maxRetryAttempts?: number;
  /**
   * The duration factor used to scale the delay between retry attempts. This can be
   * used to implement exponential backoff. For example, if `scalingDuration` is set
   * to 1000 (1 second), and a retry attempt is made, the next attempt may be delayed
   * by `scalingDuration` * `attemptCount` milliseconds.
   */
  scalingDuration?: number;
  /**
   * The fixed duration in milliseconds to wait before making a retry attempt. This
   * option is used when you want a constant delay between retries, as opposed to
   * scaling or exponential backoff.
   */
  retryDuration?: number;
};

/**
 * Extends `RetryOptions` with an additional option for determining retry behavior
 * based on the error encountered and the current attempt count. This allows for
 * dynamic adjustment of retry strategies based on the nature of the error or the
 * number of attempts already made.
 */
export type FetchTransformerOptions = {
  /**
   * A function that determines whether a fetch operation should be retried when an
   * error occurs. It receives the error and the current attempt count as arguments,
   * and returns `RetryOptions` to adjust retry behavior for the next attempt, or
   * `undefined` to stop retrying.
   *
   * @param error The error encountered during the fetch operation.
   * @param attemptCount The number of retry attempts made so far.
   * @returns `RetryOptions` to apply to the next retry attempt, or `undefined` to stop retrying.
   */
  retryWhen?: (
    error: unknown,
    attemptCount: number
  ) => RetryOptions | undefined;
} & RetryOptions;

/**
 * A function that maps a `QueryFetchEvent` to an observable stream, handling aborting the fetch operation.
 * @param {QueryFetchEvent} event - The query fetch event.
 * @returns {Observable<QueryFetchEvent>} - An observable stream of the query fetch event.
 */
const abortControllerMapper = (event: QueryFetchEvent) =>
  new Observable<QueryFetchEvent>((subscriber) => {
    subscriber.next(event);
    return () => {
      event.abortController.abort();
    };
  });

/**
 * A function that transforms a `QueryFetchEvent` stream, handling retries and aborting fetch operations.
 * @template Data - The type of data returned by the query.
 * @param {FetchOptions} options - Options for configuring fetch behavior, including retry options.
 * @param {QueryBloc<Data>} bloc - The query bloc associated with the fetch operation.
 * @returns {EventTransformer<QueryFetchEvent>} - A function that transforms the `QueryFetchEvent` stream.
 */
export const queryFetchTransformer =
  <Data>(
    options: FetchTransformerOptions,
    bloc: QueryBloc<Data>
  ): EventTransformer<QueryFetchEvent> =>
  (events$, mapper) => {
    return events$.pipe(switchMap(abortControllerMapper)).pipe(
      switchMap((event) =>
        mapper(event).pipe(
          retry({
            delay: (error, i) => {
              const retryAttempt = i;

              const defaultRetryOptions: Required<RetryOptions> = {
                maxRetryAttempts: 1,
                retryDuration: 1000,
                scalingDuration: 1000,
              };

              const retryWhenOptions = options.retryWhen
                ? options.retryWhen(error, retryAttempt)
                : {};

              const maxRetryAttempts =
                retryWhenOptions?.maxRetryAttempts ??
                options.maxRetryAttempts ??
                defaultRetryOptions.maxRetryAttempts;
              const scalingDuration =
                retryWhenOptions?.scalingDuration ??
                options.scalingDuration ??
                defaultRetryOptions.scalingDuration;
              const retryDuration =
                retryWhenOptions?.retryDuration ??
                options.retryDuration ??
                defaultRetryOptions.retryDuration;

              if (retryAttempt > maxRetryAttempts && !bloc.isClosed) {
                const errorEvent = new QueryErrorEvent(error);

                BlocObserver.observer.onEvent(bloc, errorEvent);

                const stateToEmit: Failed<Data> = {
                  status: 'isError',
                  lastUpdatedAt: bloc.state.lastUpdatedAt,
                  isInitial: false,
                  isLoading: false,
                  isFetching: false,
                  isCanceled: false,
                  isReady: false,
                  isError: true,
                  data: bloc.state.data,
                  error: error,
                };

                bloc.__unsafeEmit__(stateToEmit);

                BlocObserver.observer.onTransition(
                  bloc,
                  new Transition(bloc.state, errorEvent, stateToEmit)
                );
                return EMPTY;
              }
              const useRetryDuration =
                retryWhenOptions?.retryDuration ?? options.retryDuration;

              return timer(
                useRetryDuration
                  ? retryDuration
                  : retryAttempt * scalingDuration
              );
            },
          })
        )
      )
    );
  };
