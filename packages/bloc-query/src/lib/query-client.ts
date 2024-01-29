import {
  Observable,
  Subject,
  filter,
  firstValueFrom,
  map,
  throwError,
  timeout,
} from 'rxjs';
import {
  QueryBloc,
  QueryKey,
  QueryBlocOptions,
  GetQueryOptions,
} from './query-bloc';
import { Failed, QueryState, Ready } from './query-state';

export type RevalidateQueryOptions = {
  queryKey?: QueryKey;
  predicate?: (queryKey: QueryKey) => boolean;
};

export type GetQueryData<Data> = string | Observable<QueryState<Data>>;

export type ReadyOrFailed<Data> = Ready<Data> | Failed<Data>;

/**
 * Represents a client for managing and interacting with queries.
 */
export class QueryClient {
  private _isClosed = false;
  private _closeSignal$ = new Subject<QueryKey>();
  constructor() {
    this._closeSignal$.subscribe({
      next: (key) => this.removeQuery(key),
    });
  }

  /**
   * Indicates whether the QueryClient is closed.
   * @returns {boolean} - True if the QueryClient is closed, false otherwise.
   */
  get isClosed() {
    return this._isClosed;
  }
  /**
   * The map containing the registered queries.
   * @type {Map<string, QueryBloc<any>>}
   * @private
   */
  private queryMap: Map<string, QueryBloc<any>> = new Map();

  /**
   * Retrieves an observable for a specified query. If the query does not exist, it creates a new one.
   * @template Data - The type of data returned by the query.
   * @template Selected - The type of the selected data from the query state.
   * @param {GetQueryOptions<Data, Selected>} options - The options for getting or creating the query.
   * @returns {Observable<Selected>} - An observable for the selected data.
   * @throws {QueryClientClosedException} - If the QueryClient is closed.
   */
  getQuery = <Data, Selected = QueryState<Data>>(
    options: GetQueryOptions<Data, Selected>
  ): Observable<Selected> => {
    if (this.isClosed) throw new QueryClientClosedException();
    if (!this.queryMap.has(options.queryKey)) {
      return this.createQuery<Data>(options).getQuery<Selected>(
        options.selector,
        options.comparator
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.queryMap
        .get(options.queryKey)!
        .getQuery<Selected>(options.selector, options.comparator);
    }
  };

  /**
   * Retrieves the data for a given query either by its key or an observable.
   * @template Data - The type of the data returned by the query.
   * @param {GetQueryData<Data>} keyOrQuery - The key or the observable of the query.
   * @param {object} [options] - Additional options such as timeout.
   * @returns {Promise<Data>} - A promise resolved with the query data.
   * @throws {QueryNotFoundException} - If the query is not found.
   * @throws {QueryClientClosedException} - If the QueryClient is closed.
   * @throws {QueryCanceledException} - If the query has been canceled.
   * @throws {QueryTimeoutException} - If the query operation exceeds the specified timeout.
   */
  getQueryData = async <Data = unknown>(
    keyOrQuery: GetQueryData<Data>,
    options?: {
      timeout?: number;
    }
  ): Promise<Data> => {
    if (this.isClosed) throw new QueryClientClosedException();
    const query =
      typeof keyOrQuery === 'string'
        ? this.queryMap.get(keyOrQuery)?.getQuery()
        : keyOrQuery;

    if (query) {
      return firstValueFrom<Data>(
        query.pipe(
          filter(
            (state: QueryState<Data>): state is ReadyOrFailed<Data> =>
              state.isReady || state.isError || state.isCanceled
          ),
          map((state) => {
            if (state.isError) throw state.error;
            if (state.isCanceled) throw new QueryCanceledException();
            return state.data;
          }),
          timeout({
            each: options?.timeout ?? 60 * 1000,
            with: () => throwError(() => new QueryTimeoutException()),
          })
        )
      );
    }

    throw new QueryNotFoundException(keyOrQuery.toString());
  };

  /**
   * Clears all registered queries and closes them.
   */
  clear = () => {
    this.queryMap.forEach((query) => {
      query.close();
    });
    this.queryMap.clear();
  };

  /**
   * Removes a specified query from the QueryClient.
   * @param {QueryKey} key - The key of the query to be removed.
   * @returns {boolean} - True if the query was successfully removed, false otherwise.
   */
  removeQuery = (key: QueryKey): boolean => {
    if (this.queryMap.has(key)) {
      const bloc = this.queryMap.get(key);
      bloc?.close();
      return this.queryMap.delete(key);
    }

    return false;
  };

  private createQuery<Data = unknown>(
    options: QueryBlocOptions<Data>
  ): QueryBloc<Data> {
    if (options.initialData !== undefined) {
      const bloc = new QueryBloc(
        {
          status: 'isInitial',
          lastUpdatedAt: Date.now(),
          isInitial: true,
          isFetching: false,
          isLoading: false,
          isReady: true,
          isError: false,
          isCanceled: false,
          data: options.initialData,
        },
        options,
        this._closeSignal$
      );

      this.queryMap.set(options.queryKey, bloc);
      return bloc;
    } else {
      const bloc = new QueryBloc(
        {
          status: 'isLoading',
          lastUpdatedAt: Date.now(),
          isInitial: false,
          isFetching: true,
          isLoading: true,
          isReady: false,
          isError: false,
          isCanceled: false,
        },
        options,
        this._closeSignal$
      );

      this.queryMap.set(options.queryKey, bloc);
      return bloc;
    }
  }

  /**
   * Gets an array of all query keys registered in the QueryClient.
   * @returns {Array<QueryKey>} - An array of query keys.
   */
  getQueryKeys = (): Array<QueryKey> => {
    return Array.from(this.queryMap.keys());
  };

  /**
   * Sets new data for a specified query.
   * @template Data - The type of the data returned by the query.
   * @param {string} queryKey - The key of the query to be updated.
   * @param {((old: Data) => Data) | Data} set - The new data or a function to update the old data.
   */
  setQueryData = <Data>(
    queryKey: string,
    set: ((old: Data) => Data) | Data
  ) => {
    const queryBloc = this.queryMap.get(queryKey);
    if (queryBloc) {
      queryBloc.setQueryData(set);
    }
  };

  /**
   * Revalidates all or selected queries based on the provided options.
   * @param {RevalidateQueryOptions} [options] - Options to specify which queries to revalidate.
   */
  revalidateQueries = (options?: RevalidateQueryOptions) => {
    const predicate = options?.predicate;
    const queryKey = options?.queryKey;
    this.getQueryKeys().forEach((key) => {
      if (!predicate && !queryKey) {
        return this.queryMap.get(key)?.revalidateQuery();
      }

      if ((queryKey && queryKey === key) || (predicate && predicate(key))) {
        this.queryMap.get(key)?.revalidateQuery();
      }
    });
  };

  /**
   * Cancels an ongoing fetch operation for a specified query.
   * @param {string} queryKey - The key of the query to cancel.
   */
  cancelQuery = (queryKey: string) => {
    this.queryMap.get(queryKey)?.cancelQuery();
  };

  /**
   * Closes the QueryClient, clearing all queries and completing the close signal.
   */
  close = () => {
    this._isClosed = true;
    this.clear();
    this._closeSignal$.complete();
  };
}

/**
 * Represents an exception thrown when a query is not found in the QueryClient.
 * This exception is thrown when attempting to access a query that does not exist in the QueryClient's query map.
 * @extends {Error}
 */
export class QueryNotFoundException extends Error {
  /**
   * Creates a new QueryNotFoundException instance.
   * @param {string} key - The key of the query that was not found.
   * @param {string} [message='Query ${key} is not found'] - The error message.
   */
  override name = 'QueryNotFoundException';
  constructor(key: string, message = `Query ${key} is not found`) {
    super(message);
    Object.setPrototypeOf(this, QueryNotFoundException.prototype);
  }
}

/**
 * Represents an exception thrown when a query has been canceled.
 * This exception is used to indicate that an operation on a query cannot be completed because the query has been canceled.
 * @extends {Error}
 */
export class QueryCanceledException extends Error {
  /**
   * Creates a new QueryCanceledException instance.
   * @param {string} [message='QueryCanceledException: The query has been canceled'] - The error message.
   */
  override name = 'QueryCanceledException';
  constructor(message = 'QueryCanceledException: The query has been canceled') {
    super(message);
    Object.setPrototypeOf(this, QueryCanceledException.prototype);
  }
}

/**
 * Represents an exception thrown when a query operation times out.
 * This exception is used to signal that a query has not completed in the expected timeframe.
 * @extends {Error}
 */
export class QueryTimeoutException extends Error {
  /**
   * Creates a new QueryTimeoutException instance.
   * @param {string} [message='QueryTimeoutException: The query has timed out'] - The error message.
   */
  override name = 'QueryTimeoutException';
  constructor(message = 'QueryTimeoutException: The query has timed out') {
    super(message);
    Object.setPrototypeOf(this, QueryTimeoutException.prototype);
  }
}

/**
 * Represents an exception thrown when the QueryClient is closed.
 * This exception is thrown when an operation is attempted on a QueryClient that has been closed.
 * @extends {Error}
 */
export class QueryClientClosedException extends Error {
  /**
   * Creates a new QueryClientClosedException instance.
   * @param {string} [message='QueryClient has already been closed'] - The error message.
   */
  override name = 'QueryClientClosedException';
  constructor(message = 'QueryClient has already been closed') {
    super(message);
    Object.setPrototypeOf(this, QueryClientClosedException.prototype);
  }
}
