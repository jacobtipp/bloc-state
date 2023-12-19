import { Bloc, Emitter, Transition } from '@jacobtipp/bloc';
import {
  Observable,
  OperatorFunction,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs';
import {
  QueryFetchEvent,
  QueryEvent,
  QuerySubscriptionEvent,
  QueryRevalidateEvent,
} from './query-event';
import {
  FetchTransformerOptions,
  queryFetchTransformer,
} from './query-fetch-transformer';
import { Fetching, QueryState, Ready } from './query-state';

export type QueryKey = string;

export type QueryOptions<Data> = {
  initialData?: Data;
  staleTime?: number;
  queryKey: QueryKey;
  queryFn: (options: QueryFnOptions) => Promise<Data>;
};

export type QueryBlocOptions<Data> = {
  name?: string;
  staleTime?: number;
} & FetchTransformerOptions &
  QueryOptions<Data>;

export type QueryFnOptions = {
  signal: AbortSignal;
};

export type GetQueryOptions<Data = unknown, Selected = QueryState<Data>> = {
  selector?: (state: Ready<Data>) => Selected;
  comparator?: (previous: Selected, current: Selected) => boolean;
} & QueryOptions<Data> &
  FetchTransformerOptions;

/**
 * Represents a Bloc for handling queries.
 * @template Data - The type of the data returned by the query.
 * @extends {Bloc<QueryEvent, QueryState<Data>>}
 */
export class QueryBloc<Data = unknown> extends Bloc<
  QueryEvent,
  QueryState<Data>
> {
  private staleTime: number;
  private handledInitialLoad = false;
  private revertedState: QueryState<Data>;

  /**
   * Creates a new QueryBloc instance.
   * @param {QueryState<Data>} state - The initial state of the query.
   * @param {QueryBlocOptions<Data>} options - The options for creating the query bloc.
   */
  constructor(
    state: QueryState<Data>,
    private options: QueryBlocOptions<Data>
  ) {
    const name = `QueryBloc - ${options.name ?? options.queryKey}`;
    super(state, name);
    this.revertedState = state;
    this.staleTime = options.staleTime ?? 0;

    this.on(QuerySubscriptionEvent, this.onQuerySubscription);
    this.on(
      QueryFetchEvent,
      this.onQueryFetch,
      queryFetchTransformer(
        {
          maxRetryAttempts: options.maxRetryAttempts,
          retryDuration: options.retryDuration,
          scalingDuration: options.scalingDuration,
          retryWhen: options.retryWhen,
        },
        this
      )
    );
  }

  private async onQueryFetch(
    event: QueryFetchEvent,
    emit: Emitter<QueryState<Data>>
  ) {
    if (event.cancel) return;

    const signal = event.abortController.signal;

    try {
      const data = await this.options.queryFn({
        signal,
      });

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
    } catch (e: unknown) {
      if (!signal.aborted) {
        throw e;
      }
    }
  }

  private onQuerySubscription(
    _event: QuerySubscriptionEvent,
    _emit: Emitter<QueryState<Data>>
  ) {
    if (this.state.status === 'isLoading' && !this.handledInitialLoad) {
      this.handledInitialLoad = true;
      this.revertedState = this.state;
      this.add(new QueryFetchEvent(new AbortController()));
    }

    if (this.state.isReady && this.isStale) {
      this.revalidateQuery();
    }
  }

  /**
   * Checks if the query data is stale based on the last update time and stale time.
   * @type {boolean}
   */
  get isStale() {
    const now = Date.now();
    return this.state.lastUpdatedAt + this.staleTime <= now;
  }

  /**
   * Gets an observable for the query state.
   * @template Selected - The type of the selected data.
   * @param {(state: Ready<Data>) => Selected} [selector] - A function to select data from the query state.
   * @param {(previous: Selected, current: Selected) => boolean} [comparer] - A function to compare selected data.
   * @returns {Observable<Selected>} - An observable for the selected data.
   * @throws {QueryClosedException} - If the query is closed.
   */
  getQuery = <Selected = QueryState<Data>>(
    selector?: (state: Ready<Data>) => Selected,
    comparer?: (previous: Selected, current: Selected) => boolean
  ): Observable<Selected> => {
    if (this.isClosed) {
      throw new QueryClosedException('Query is closed');
    }

    this.add(new QuerySubscriptionEvent());

    return this.state$.pipe(
      startWith(this.state),
      filter((state) => (selector ? state.status === 'isReady' : true)),
      map((state) =>
        selector ? selector(state as Ready<Data>) : state
      ) as OperatorFunction<QueryState<Data>, Selected>,
      distinctUntilChanged(comparer)
    );
  };

  /**
   * Sets new data for the query.
   * @param {((old: Data) => Data) | Data} set - The new data or a function to update the old data.
   */
  setQueryData = (set: ((old: Data) => Data) | Data) => {
    let newData: Data;
    if (typeof set === 'function') {
      if (this.state.data === undefined) {
        throw new SetQueryDataException(
          'SetQueryData: cannot be set with a callback function if previous data is undefined, invoke setQueryData with data directly ' +
            'or provide initial data for the query'
        );
      }
      newData = (set as (old: Data) => Data)(this.state.data);
    } else {
      newData = set;
    }

    this.emit({
      status: 'isReady',
      isInitial: false,
      lastUpdatedAt: Date.now(),
      isLoading: false,
      isFetching: false,
      isReady: true,
      isError: false,
      data: newData,
    });
  };

  /**
   * Cancels the query, aborting the ongoing fetch operation.
   */
  cancelQuery = () => {
    if (!this.state.isFetching) return;
    this.add(new QueryFetchEvent(new AbortController(), true));
    this.emit(this.revertedState);
  };

  /**
   * Revalidates the query, triggering a new fetch operation.
   */
  revalidateQuery = () => {
    this.cancelQuery();
    this.revertedState = this.state;

    const revalidateEvent = new QueryRevalidateEvent();
    Bloc.observer.onEvent(this, revalidateEvent);

    const stateToEmit: Fetching<Data> = {
      status: 'isFetching',
      lastUpdatedAt: this.state.lastUpdatedAt,
      isInitial: false,
      isLoading: false,
      isFetching: true,
      isReady: false,
      isError: false,
      data: this.state.data,
    };

    this.emit(stateToEmit);

    Bloc.observer.onTransition(
      this,
      new Transition(this.revertedState, revalidateEvent, stateToEmit)
    );

    this.add(new QueryFetchEvent(new AbortController()));
  };
}

/**
 * Represents an exception thrown when attempting to set query data in an invalid manner.
 * @extends {Error}
 */
export class SetQueryDataException extends Error {
  /**
   * Creates a new SetQueryDataException instance.
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, SetQueryDataException.prototype);
  }
}

/**
 * Represents an exception thrown when attempting to interact with a closed query.
 * @extends {Error}
 */
export class QueryClosedException extends Error {
  /**
   * Creates a new QueryClosedException instance.
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, QueryClosedException.prototype);
  }
}
