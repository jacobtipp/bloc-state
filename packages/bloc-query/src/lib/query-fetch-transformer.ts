import { switchMap, Observable, EMPTY, timer, retry } from 'rxjs';
import { Bloc, EventTransformer, Transition } from '@jacobtipp/bloc';
import { Failed, QueryBloc, QueryErrorEvent, QueryFetchEvent } from '.';

export type RetryOptions = {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  retryDuration?: number;
};

export type FetchTransformerOptions = {
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
                Bloc.observer.onEvent(bloc, errorEvent);

                const stateToEmit: Failed<Data> = {
                  status: 'isError',
                  lastUpdatedAt: bloc.state.lastUpdatedAt,
                  isInitial: false,
                  isLoading: false,
                  isFetching: false,
                  isReady: false,
                  isError: true,
                  data: bloc.state.data,
                  error: error,
                };

                bloc.__unsafeEmit__(stateToEmit);

                Bloc.observer.onTransition(
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
