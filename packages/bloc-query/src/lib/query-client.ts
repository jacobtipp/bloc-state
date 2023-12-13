import { Observable, filter, firstValueFrom, map } from 'rxjs';

import { GetQueryOptions, QueryBloc, QueryKey } from './query-bloc';
import { QueryState } from './query-state';
export type RevalidateQueryOptions = {
  queryKey?: QueryKey;
  predicate?: (queryKey: QueryKey) => boolean;
};

export type GetQueryData<Data> = string | Observable<QueryState<Data>>;

export class QueryClient {
  private queryMap: Map<string, QueryBloc<any>> = new Map();

  getQuery = <Data, Selected = QueryState<Data>>(
    options: GetQueryOptions<Data, Selected>
  ): Observable<Selected> => {
    if (!this.queryMap.has(options.queryKey)) {
      return this.createQuery<Data, Selected>(options).getQuery<Selected>(
        options.selector
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.queryMap
        .get(options.queryKey)!
        .getQuery<Selected>(options.selector);
    }
  };

  getQueryData = async <Data = unknown>(keyOrQuery: GetQueryData<Data>) => {
    const query =
      typeof keyOrQuery === 'string'
        ? this.queryMap.get(keyOrQuery)?.getQuery()
        : keyOrQuery;

    if (query) {
      return firstValueFrom<Data>(
        query.pipe(
          filter((state) => state.isReady),
          map((state) => state.data)
        )
      );
    }

    throw new QueryNotFoundException(
      `QueryNotFoundException: query ${keyOrQuery} does not exist in the QueryClient.`
    );
  };

  clear = () => {
    this.queryMap.forEach((query) => {
      query.close();
    });
    this.queryMap.clear();
  };

  removeQuery = (key: QueryKey): boolean => {
    if (this.queryMap.has(key)) {
      const bloc = this.queryMap.get(key);
      bloc?.close();
      return this.queryMap.delete(key);
    }

    return false;
  };

  private createQuery<Data = unknown, Selected = QueryState<Data>>(
    options: GetQueryOptions<Data, Selected>
  ): QueryBloc<Data, Selected> {
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

  getQueryKeys = () => {
    return Array.from(this.queryMap.keys());
  };

  setQueryData = <Data>(
    queryKey: string,
    set: ((old: Data) => Data) | Data
  ) => {
    const queryBloc = this.queryMap.get(queryKey);
    if (queryBloc) {
      queryBloc.setQueryData(set);
    }
  };

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

  cancelQuery = (queryKey: string) => {
    this.queryMap.get(queryKey)?.cancelQuery();
  };
}

/**
 * Represents an error that occurs when there is an issue with the state of the application.
 */
export class QueryNotFoundException extends Error {
  /**
   * Creates an instance of StateError.
   *
   * @param message The error message.
   */
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, QueryNotFoundException.prototype);
  }
}
