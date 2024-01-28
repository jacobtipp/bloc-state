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

export type QueryKey = string;

export type QueryOptions<Data> = {
  initialData?: Data;
  staleTime?: number;
  keepAlive?: number;
  logErrors?: boolean;
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
    super(state, name);
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

    if (this.state.isReady && this.isStale) {
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
      isError: false,
      isCanceled: false,
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

  listen = () => {
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
   * Cancels the query, aborting the ongoing fetch operation.
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
   * Revalidates the query, triggering a new fetch operation.
   */
  revalidateQuery = () => {
    this.cancelQuery();
    this.revertedState = this.state;

    const revalidateEvent = new QueryRevalidateEvent();
    BlocObserver.observer.onEvent(this, revalidateEvent);

    const stateToEmit: Fetching<Data> = {
      status: 'isFetching',
      lastUpdatedAt: this.state.lastUpdatedAt,
      isInitial: false,
      isLoading: false,
      isFetching: true,
      isReady: false,
      isError: false,
      isCanceled: false,
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
