import { Observable, filter, firstValueFrom, map } from 'rxjs';

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
   * Gets the observable for a query or creates a new query if it doesn't exist.
   * @template Data - The type of the data returned by the query.
   * @template Selected - The type of the selected data.
   * @param {GetQueryOptions<Data, Selected>} options - The options for the query.
   * @returns {Observable<Selected>} - An observable for the selected data.
   */
  getQuery = <Data, Selected = QueryState<Data>>(
    options: GetQueryOptions<Data, Selected>
  ): Observable<Selected> => {
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
   * Gets the data for a query.
   * @template Data - The type of the data returned by the query.
   * @param {string | Observable<QueryState<Data>>} keyOrQuery - The key or observable of the query.
   * @returns {Promise<Data>} - A promise that resolves to the query data.
   * @throws {QueryNotFoundException} - If the query does not exist in the QueryClient.
   */
  getQueryData = async <Data = unknown>(
    keyOrQuery: GetQueryData<Data>
  ): Promise<Data> => {
    const query =
      typeof keyOrQuery === 'string'
        ? this.queryMap.get(keyOrQuery)?.getQuery()
        : keyOrQuery;

    if (query) {
      return firstValueFrom<Data>(
        query.pipe(
          filter(
            (state: QueryState<Data>): state is ReadyOrFailed<Data> =>
              state.isReady || state.isError
          ),
          map((state) => {
            if (state.isError) throw state.error;
            return state.data;
          })
        )
      );
    }

    throw new QueryNotFoundException(
      `QueryNotFoundException: query ${keyOrQuery} does not exist in the QueryClient.`
    );
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
   * Removes a query from the QueryClient.
   * @param {QueryKey} key - The key of the query to be removed.
   * @returns {boolean} - Returns true if the query was successfully removed, false otherwise.
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
          data: options.initialData,
        },
        options
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
        },
        options
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
   * Sets new data for a query.
   * @template Data - The type of the data returned by the query.
   * @param {string} queryKey - The key of the query to update.
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
   * Revalidates all or selected queries.
   * @param {RevalidateQueryOptions} [options] - Options for revalidating queries.
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
   * Cancels an ongoing fetch operation for a query.
   * @param {string} queryKey - The key of the query to cancel.
   */
  cancelQuery = (queryKey: string) => {
    this.queryMap.get(queryKey)?.cancelQuery();
  };

  close = () => {
    this._isClosed = true;
    this.clear();
  };
}

/**
 * Represents an exception thrown when a query is not found in the QueryClient.
 * @extends {Error}
 */
export class QueryNotFoundException extends Error {
  /**
   * Creates a new QueryNotFoundException instance.
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, QueryNotFoundException.prototype);
  }
}
