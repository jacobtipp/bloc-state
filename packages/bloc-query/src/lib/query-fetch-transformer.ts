import { switchMap, Observable, EMPTY, timer, retry } from 'rxjs';
import { EventTransformer } from '@jacobtipp/bloc';
import { QueryBloc, QueryErrorEvent, QueryFetchEvent } from '.';

export type RetryOptions = {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  retryDuration?: number;
};

export type FetchOptions = {
  retryWhen?: (
    error: unknown,
    attemptCount: number
  ) => RetryOptions | undefined;
} & RetryOptions;

const abortControllerMapper = (event: QueryFetchEvent) =>
  new Observable<QueryFetchEvent>((subscriber) => {
    subscriber.next(event);
    return () => {
      event.abortController.abort();
    };
  });

export const queryFetchTransformer =
  <Data>(
    options: FetchOptions,
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
                bloc.add(new QueryErrorEvent(error));
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
