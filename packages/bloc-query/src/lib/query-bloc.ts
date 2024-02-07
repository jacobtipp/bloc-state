import { Bloc, BlocObserver, Emitter, Transition } from '@jacobtipp/bloc';
import {
  Observable,
  OperatorFunction,
  Subject,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs';
import {
  QueryFetchEvent,
  QueryEvent,
  QueryRevalidateEvent,
  QueryCancelEvent,
  SetQueryDataEvent,
} from './query-event';
import {
  FetchTransformerOptions,
  queryFetchTransformer,
} from './query-fetch-transformer';
import { Fetching, QueryState, Ready } from './query-state';

/**
 * Represents the unique key used to identify a query. This is typically a string
 * that uniquely identifies the data being fetched or manipulated.
 */
export type QueryKey = string;

/**
 * Defines the configuration options available for a query operation. These options
 * dictate how the query behaves, including its initial state, cache behavior, and
 * error logging.
 *
 * @template Data The type of data expected to be returned by the query function.
 */
export type QueryOptions<Data> = {
  /** Initial data to be used before the query completes. Useful for SSR or initial placeholders. */
  initialData?: Data;
  /** Time in milliseconds after which the data is considered stale and may be refetched. */
  staleTime?: number;
  /** Time in milliseconds to keep the data alive in cache after it becomes inactive. */
  keepAlive?: number;
  /** Whether to log errors to the console. */
  logErrors?: boolean;
  /** A unique key to identify the query. */
  queryKey: QueryKey;
  /** A function returning a promise that resolves with the data. */
  queryFn: (options: QueryFnOptions) => Promise<Data>;
};

/**
 * Extends `QueryOptions` with additional options specific to QueryBloc, which may
 * include options for naming the bloc and configuring stale time at the bloc level.
 *
 * @template Data The type of data expected to be returned by the query function.
 */
export type QueryBlocOptions<Data> = {
  /** Optional name for the bloc. Useful for debugging or identification. */
  name?: string;
  /** Time in milliseconds after which the data in the bloc is considered stale. */
  staleTime?: number;
} & FetchTransformerOptions &
  QueryOptions<Data>;

/**
 * Options passed to the query function, providing it with an `AbortSignal` to
 * support cancellable fetch operations.
 */
export type QueryFnOptions = {
  /** An AbortSignal to signal the fetch operation can be cancelled. */
  signal: AbortSignal;
};

/**
 * Configuration options for retrieving query data, allowing for the selection
 * of a specific part of the query state and comparison of state for updates.
 *
 * @template Data The type of data managed by the query.
 * @template Selected The type of the selected or derived data from the query state.
 */
export type GetQueryOptions<Data = unknown, Selected = QueryState<Data>> = {
  /** Optional selector function to derive a part of the state. */
  selector?: (state: Ready<Data>) => Selected;
  /** Optional comparator function to determine if the selected state has changed. */
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
  private logErrors: boolean;
  private handledInitialLoad = false;
  private revertedState: QueryState<Data>;

  /**
   * Creates a new QueryBloc instance.
   * @param {QueryState<Data>} state - The initial state of the query.
   * @param {QueryBlocOptions<Data>} options - The options for creating the query bloc.
   */
  constructor(
    state: QueryState<Data>,
    private options: QueryBlocOptions<Data>,
    private closeSignal: Subject<QueryKey>
  ) {
    const name = `QueryBloc - ${options.name ?? options.queryKey}`;
    super(state, { name: name });
    this.revertedState = state;
    this.staleTime = options.staleTime ?? 0;
    this.logErrors = options.logErrors ?? false;

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

  protected override onError(error: Error): void {
    if (this.logErrors) {
      super.onError(error);
    }
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
        isCanceled: false,
        data: data,
      });
    } catch (e: unknown) {
      if (!signal.aborted) {
        throw e;
      }
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

    if (this.state.status === 'isLoading' && !this.handledInitialLoad) {
      this.handledInitialLoad = true;
      this.revertedState = this.state;
      this.add(new QueryFetchEvent(new AbortController()));
    }

    if ((this.state.isReady && this.isStale) || this.state.isCanceled) {
      this.revalidateQuery();
    }

    return this.listen().pipe(
      startWith(this.state),
      filter(({ isReady, isError }) => (selector ? isReady || isError : true)),
      map((state) => {
        if (state.isError && selector) {
          throw state.error;
        }
        return selector ? selector(state as Ready<Data>) : state;
      }) as OperatorFunction<QueryState<Data>, Selected>,
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

    const setQueryDataEvent = new SetQueryDataEvent();
    BlocObserver.observer.onEvent(this, setQueryDataEvent);

    const previous = this.state;
    const stateToEmit: Ready<Data> = {
      status: 'isReady',
      isInitial: false,
      lastUpdatedAt: Date.now(),
      isLoading: false,
      isFetching: false,
      isReady: true,
      isCanceled: false,
      isError: false,
      data: newData,
    };

    this.emit(stateToEmit);

    BlocObserver.observer.onTransition(
      this,
      new Transition(previous, setQueryDataEvent, stateToEmit)
    );
  };

  private subscribers = 0;

  private pendingCloseTimeout: NodeJS.Timeout | null = null;

  /**
   * Returns an observable that provides updates of the query state.
   * This method is used to subscribe to the query's state changes.
   * @returns {Observable<QueryState<Data>>} An Observable that emits updates of the query state.
   */
  listen = (): Observable<QueryState<Data>> => {
    return new Observable<QueryState<Data>>((subscriber) => {
      this.subscribers++;
      const stateSubscription = this.state$.subscribe(subscriber);
      return () => {
        this.subscribers--;
        stateSubscription.unsubscribe();
        if (this.subscribers <= 0) {
          if (this.options?.keepAlive === Infinity) return;
          if (this.pendingCloseTimeout) clearTimeout(this.pendingCloseTimeout);
          this.pendingCloseTimeout = setTimeout(() => {
            if (this.subscribers <= 0)
              this.closeSignal.next(this.options.queryKey);
          }, this.options?.keepAlive ?? 60 * 1000);
        }
      };
    });
  };

  /**
   * Cancels the query, aborting the ongoing fetch operation and reverting the state.
   * It emits a 'QueryCancelEvent' and updates the state accordingly.
   */
  cancelQuery = () => {
    if (!this.state.isFetching) return;

    if (this.state.isLoading && this.handledInitialLoad) {
      this.handledInitialLoad = false;
    }

    this.add(new QueryFetchEvent(new AbortController(), true));

    const cancelEvent = new QueryCancelEvent();
    BlocObserver.observer.onEvent(this, cancelEvent);

    const previous = this.state;
    this.emit({ ...this.revertedState, isCanceled: true });

    BlocObserver.observer.onTransition(
      this,
      new Transition(previous, cancelEvent, this.state)
    );
  };

  /**
   * Revalidates the query, triggering a new fetch operation if the query is stale or canceled.
   * It emits a 'QueryRevalidateEvent' and updates the state to reflect the fetching status.
   */
  revalidateQuery = () => {
    this.revertedState = this.state;

    const revalidateEvent = new QueryRevalidateEvent();
    BlocObserver.observer.onEvent(this, revalidateEvent);

    const stateToEmit: Fetching<Data> = {
      status: 'isFetching',
      lastUpdatedAt: this.state.lastUpdatedAt,
      isInitial: false,
      isLoading: false,
      isFetching: true,
      isCanceled: false,
      isReady: false,
      isError: false,
      data: this.state.data,
    };

    this.emit(stateToEmit);

    BlocObserver.observer.onTransition(
      this,
      new Transition(this.revertedState, revalidateEvent, stateToEmit)
    );

    this.add(new QueryFetchEvent(new AbortController()));
  };
}

/**
 * Represents an exception thrown when attempting to set query data in an invalid manner.
 * This exception is thrown when the new data for a query cannot be set due to a missing previous data state or other constraints.
 * @extends {Error}
 */
export class SetQueryDataException extends Error {
  /**
   * Creates a new SetQueryDataException instance.
   * @param {string} message - The error message.
   */

  override name = 'SetQueryDataException';
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, SetQueryDataException.prototype);
  }
}

/**
 * Represents an exception thrown when attempting to interact with a closed query.
 * This exception is thrown when operations are performed on a query that has been closed or is no longer available.
 * @extends {Error}
 */
export class QueryClosedException extends Error {
  /**
   * Creates a new QueryClosedException instance.
   * @param {string} message - The error message.
   */
  override name = 'QueryClosedException';
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, QueryClosedException.prototype);
  }
}
