import { switchMap, Observable, EMPTY, timer, retry } from 'rxjs';
import { EventTransformer } from '@jacobtipp/bloc';
import { QueryBloc } from '.';
import { FetchEvent } from './query-event';

export type FetchOptions = {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  retryDuration?: number;
};

const abortControllerMapper = (event: FetchEvent) =>
  new Observable<FetchEvent>((subscriber) => {
    subscriber.next(event);
    return () => {
      event.abortController.abort();
    };
  });

export const queryFetchTransformer =
  <Data>(
    options: FetchOptions,
    bloc: QueryBloc<Data>
  ): EventTransformer<FetchEvent> =>
  (events$, mapper) => {
    return events$.pipe(switchMap(abortControllerMapper)).pipe(
      switchMap((event) =>
        mapper(event).pipe(
          retry({
            delay: (error, i) => {
              const retryAttempt = i;
              const maxRetryAttempts = options.maxRetryAttempts ?? 1;
              const retryDuration = options.retryDuration ?? 1000;
              const scalingDuration = options.scalingDuration ?? 1000;

              if (retryAttempt > maxRetryAttempts && !bloc.isClosed) {
                bloc.__unsafeEmit__({
                  status: 'isError',
                  lastUpdatedAt: bloc.state.lastUpdatedAt,
                  isInitial: false,
                  isLoading: false,
                  isFetching: false,
                  isReady: false,
                  isError: true,
                  data: bloc.state.data,
                  error,
                });
                return EMPTY;
              }

              const duration = options.retryDuration
                ? retryDuration
                : retryAttempt * scalingDuration;

              return timer(duration);
            },
          })
        )
      )
    );
  };
