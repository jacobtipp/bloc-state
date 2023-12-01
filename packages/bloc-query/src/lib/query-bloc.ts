import { EMPTY, mergeMap, retryWhen, startWith, switchMap, timer } from 'rxjs';
import { Bloc, EventTransformer } from '@jacobtipp/bloc';
import { restartable } from '@jacobtipp/bloc-concurrency';

export type FetchOptions = {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  retryDuration?: number;
};

const queryFetchTransformer =
  <Data>(
    options: FetchOptions,
    bloc: Bloc<FetchEvent, QueryState<Data>>
  ): EventTransformer<FetchEvent> =>
  (events$, mapper) => {
    return events$.pipe(
      switchMap((event) =>
        mapper(event).pipe(
          retryWhen((errors) => {
            return errors.pipe(
              mergeMap((error, i) => {
                const retryAttempt = i + 1;
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
              })
            );
          })
        )
      )
    );
  };

abstract class QueryEvent {
  protected _!: void;
}

export class FetchEvent extends QueryEvent {}
export class RevalidateEvent extends QueryEvent {}
export class SubscriptionEvent extends QueryEvent {}

type initial<Data> = {
  isInitial: true;
  lastUpdatedAt: number;
  isLoading: false;
  isFetching: false;
  isReady: true;
  isError: false;
  status: 'isInitial';
  data: Data;
};

type loading<Data> = {
  isInitial: false;
  lastUpdatedAt: number;
  isLoading: true;
  isFetching: true;
  isReady: false;
  isError: false;
  status: 'isLoading';
  data?: Data;
};

type fetching<Data> = {
  isInitial: false;
  lastUpdatedAt: number;
  isLoading: false;
  isFetching: true;
  isReady: false;
  isError: false;
  status: 'isFetching';
  data?: Data;
};

type ready<Data> = {
  isInitial: false;
  lastUpdatedAt: number;
  isLoading: false;
  isFetching: false;
  isReady: true;
  isError: false;
  status: 'isReady';
  data: Data;
};

type failed<Data> = {
  isInitial: false;
  lastUpdatedAt: number;
  isLoading: false;
  isFetching: false;
  isReady: false;
  isError: true;
  status: 'isError';
  data?: Data;
  error: Error;
};

export type QueryState<Data> =
  | initial<Data>
  | loading<Data>
  | fetching<Data>
  | ready<Data>
  | failed<Data>;

export type QueryKey = string;

type QueryOptions = {
  staleTime?: number;
};

export type GetQueryOptions<Data> = {
  initialData?: Data;
  name?: string;
  queryKey: QueryKey;
  queryFn: (queryKey: QueryKey) => Promise<Data>;
} & QueryOptions &
  FetchOptions;

export class QueryBloc<Data = unknown> extends Bloc<
  QueryEvent,
  QueryState<Data>
> {
  private staleTime: number;

  constructor(state: QueryState<Data>, options: GetQueryOptions<Data>) {
    super(state, options.name);
    this.staleTime = options.staleTime ?? 0;

    this.on(
      SubscriptionEvent,
      (_event, _emit) => {
        if (this.state.status === 'isLoading') {
          // if this query has no data loaded, start initial fetch
          this.add(new FetchEvent());
        }

        if (
          this.state.isReady &&
          this.state.lastUpdatedAt + this.staleTime <= Date.now()
        ) {
          this.add(new RevalidateEvent());
        }
      },
      restartable()
    );

    this.on(
      RevalidateEvent,
      (_event, emit) => {
        emit({
          status: 'isFetching',
          lastUpdatedAt: this.state.lastUpdatedAt,
          isInitial: false,
          isLoading: false,
          isFetching: true,
          isReady: false,
          isError: false,
          data: this.state.data,
        });

        this.add(new FetchEvent());
      },
      restartable()
    );

    this.on(
      FetchEvent,
      async (_event, emit) => {
        const data = await options.queryFn(options.queryKey);
        emit({
          status: 'isReady',
          lastUpdatedAt: Date.now(),
          isInitial: false,
          isLoading: false,
          isFetching: false,
          isReady: true,
          isError: false,
          data: data,
        });
      },
      queryFetchTransformer<Data>(
        {
          maxRetryAttempts: options.maxRetryAttempts,
          retryDuration: options.retryDuration,
          scalingDuration: options.scalingDuration,
        },
        this
      )
    );
  }

  getQuery() {
    if (this.isClosed) {
      throw new Error('Query is closed');
    }

    this.add(new SubscriptionEvent());
    return this.state$.pipe(startWith(this.state));
  }

  revalidateQuery() {
    this.add(new RevalidateEvent());
  }
}
