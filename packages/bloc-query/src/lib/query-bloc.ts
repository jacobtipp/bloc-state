import { Bloc } from '@jacobtipp/bloc';
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
  QuerySetQueryDataEvent,
  QueryErrorEvent,
} from './query-event';
import { FetchOptions, queryFetchTransformer } from './query-fetch-transformer';
import { QueryState, Ready } from './query-state';

/**
 * Represents a key used for querying data.
 * @typedef {string} QueryKey
 */
export type QueryKey = string;

/**
 * Represents optional configuration options for a query.
 * @typedef {Object} QueryOptions
 * @property {number} [staleTime] - The time (in milliseconds) data is considered stale.
 */
type QueryOptions = {
  staleTime?: number;
};

/**
 * Represents options for a query function.
 * @typedef {Object} QueryFnOptions
 * @property {AbortSignal} signal - The signal used to abort the query.
 */
export type QueryFnOptions = {
  signal: AbortSignal;
};

/**
 * Represents options for creating a query and fetching data.
 * @template Data - The type of the data returned by the query.
 * @template Selected - The type of the selected data.
 * @typedef {Object} GetQueryOptions
 * @property {Data} [initialData] - The initial data for the query.
 * @property {string} [name] - The name of the query.
 * @property {(state: Ready<Data>) => Selected} [selector] - A function to select data from the query state.
 * @property {(previous: Selected, current: Selected) => boolean} [comparator] - A function to compare selected data.
 * @property {QueryKey} queryKey - The key used for querying data.
 * @property {(options: QueryFnOptions) => Promise<Data>} queryFn - The function to fetch data for the query.
 * @property {QueryOptions} [staleTime] - Additional query options.
 * @property {FetchOptions} - Additional fetch options.
 */
export type GetQueryOptions<Data = unknown, Selected = QueryState<Data>> = {
  initialData?: Data;
  name?: string;
  selector?: (state: Ready<Data>) => Selected;
  comparator?: (previous: Selected, current: Selected) => boolean;
  queryKey: QueryKey;
  queryFn: (options: QueryFnOptions) => Promise<Data>;
} & QueryOptions &
  FetchOptions;

/**
 * Represents a Bloc for handling queries.
 * @template Data - The type of the data returned by the query.
 * @template Selected - The type of the selected data.
 * @extends {Bloc<QueryEvent, QueryState<Data>>}
 */
export class QueryBloc<
  Data = unknown,
  Selected = QueryState<Data>
> extends Bloc<QueryEvent, QueryState<Data>> {
  private staleTime: number;
  private handledInitialLoad = false;

  /**
   * Creates a new QueryBloc instance.
   * @param {QueryState<Data>} state - The initial state of the query.
   * @param {GetQueryOptions<Data, Selected>} options - The options for creating the query.
   */
  constructor(
    state: QueryState<Data>,
    options: GetQueryOptions<Data, Selected>
  ) {
    super(state, options.name ?? options.queryKey);
    this.staleTime = options.staleTime ?? 0;

    this.on(QuerySubscriptionEvent, (_event, _emit) => {
      if (this.state.status === 'isLoading' && !this.handledInitialLoad) {
        this.handledInitialLoad = true;
        this.add(new QueryFetchEvent(new AbortController()));
      }

      if (this.state.isReady && this.isStale) {
        this.add(new QueryRevalidateEvent());
      }
    });

    this.on(QueryRevalidateEvent, (_event, emit) => {
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

      this.add(new QueryFetchEvent(new AbortController()));
    });

    this.on(QuerySetQueryDataEvent, (event, emit) => {
      let newData: Data;
      const setEvent = event as QuerySetQueryDataEvent<Data>;
      const set = setEvent.set;
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

      emit({
        status: 'isReady',
        isInitial: false,
        lastUpdatedAt: Date.now(),
        isLoading: false,
        isFetching: false,
        isReady: true,
        isError: false,
        data: newData,
      });
    });

    this.on(QueryErrorEvent, (event, emit) => {
      emit({
        status: 'isError',
        lastUpdatedAt: this.state.lastUpdatedAt,
        isInitial: false,
        isLoading: false,
        isFetching: false,
        isReady: false,
        isError: true,
        data: this.state.data,
        error: event.error,
      });
    });

    this.on(
      QueryFetchEvent,
      async (event, emit) => {
        if (event.cancel) return;
        const data = await options.queryFn({
          signal: event.abortController.signal,
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
      },
      queryFetchTransformer<Data>(
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
    this.add(new QuerySetQueryDataEvent(set));
  };

  /**
   * Cancels the query, aborting the ongoing fetch operation.
   */
  cancelQuery = () => {
    this.add(new QueryFetchEvent(new AbortController(), true));
  };

  /**
   * Revalidates the query, triggering a new fetch operation.
   */
  revalidateQuery = () => {
    this.add(new QueryRevalidateEvent());
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
