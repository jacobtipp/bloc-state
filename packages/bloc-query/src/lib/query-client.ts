import { Observable } from 'rxjs';

import { GetQueryOptions, QueryBloc, QueryKey, QueryState } from './query-bloc';

//import { GetQueryOptions, QueryKey } from "./query-bloc";

export type RevalidateQueryOptions = {
  queryKey?: QueryKey;
  predicate?: (queryKey: QueryKey) => boolean;
};

export class QueryClient {
  private queryMap: Map<string, QueryBloc<any>> = new Map();

  getQuery<Data>(options: GetQueryOptions<Data>): Observable<QueryState<Data>> {
    if (!this.queryMap.has(options.queryKey)) {
      return this.createQuery<Data>(options).getQuery();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.queryMap.get(options.queryKey)!.getQuery();
    }
  }

  getQueryData<Data = unknown>(queryKey: string) {
    const data = this.queryMap.get(queryKey)?.state.data;
    return data ? (data as Data) : undefined;
  }

  close() {
    this.queryMap.forEach((query) => {
      query.close();
    });
    this.queryMap.clear();
  }

  removeQuery(key: QueryKey): boolean {
    if (this.queryMap.has(key)) {
      const bloc = this.queryMap.get(key);
      bloc?.close();
      return this.queryMap.delete(key);
    }

    return false;
  }

  private createQuery<Data>(options: GetQueryOptions<Data>): QueryBloc<Data> {
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

  getQueryKeys() {
    return Array.from(this.queryMap.keys());
  }

  setQueryData = <Data>(
    queryKey: string,
    set: ((old: Data) => Data) | Data
  ) => {
    const queryBloc = this.queryMap.get(queryKey);
    if (queryBloc) {
      queryBloc.setQueryData(set);
    }
  };

  revalidateQueries(options?: RevalidateQueryOptions) {
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
  }
}
