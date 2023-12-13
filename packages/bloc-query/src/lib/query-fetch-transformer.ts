import { switchMap, Observable, EMPTY, timer, retry } from 'rxjs';
import { EventTransformer } from '@jacobtipp/bloc';
import { QueryBloc, QueryErrorEvent, QueryFetchEvent } from '.';

export type FetchOptions = {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  retryDuration?: number;
};

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
              const maxRetryAttempts = options.maxRetryAttempts ?? 1;
              const retryDuration = options.retryDuration ?? 1000;
              const scalingDuration = options.scalingDuration ?? 1000;

              if (retryAttempt > maxRetryAttempts && !bloc.isClosed) {
                bloc.add(new QueryErrorEvent(error));
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
