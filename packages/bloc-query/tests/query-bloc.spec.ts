//import { getRandomInt } from './helpers/random';
import { take, config } from 'rxjs';
import { GetQueryOptions, QueryBloc, SetQueryDataException } from '../src/lib';
import { delay } from './helpers/delay';
import { QueryFetchEvent } from '../src/lib/query-event';
import { QueryState } from '../src/lib/query-state';

describe('QueryBloc', () => {
  it('should not allow new subscriptions if the query is closed', (done) => {
    const queryFn = () => {
      return Promise.resolve(1);
    };
    const options: GetQueryOptions<number> = {
      initialData: 0,
      queryFn,
      queryKey: '0',
    };

    const bloc = new QueryBloc<number>(
      {
        status: 'isInitial',
        lastUpdatedAt: Date.now(),
        isInitial: true,
        isLoading: false,
        isFetching: false,
        isError: false,
        isReady: true,
        data: 0,
      },
      options
    );

    const states: QueryState<number>[] = [];

    expect(bloc).toBeDefined();
    expect(bloc.state.data).toBe(0);

    bloc
      .getQuery()
      .pipe(take(2))
      .subscribe({
        next: (state) => states.push(state),
        complete: () => {
          const [a, b] = states;
          expect(a.status).toBe('isFetching');
          expect(b.status).toBe('isReady');
          bloc.close();
          try {
            bloc.getQuery();
          } catch (e) {
            expect(e).toBeInstanceOf(Error);
          }
          done();
        },
      });
  });

  describe('Retry', () => {
    let bloc: QueryBloc<number>;
    let calls = 0;
    let maxRetryAttempts: number;
    let retryDuration: number;

    afterEach(() => {
      bloc.close();
      calls = 0;
      maxRetryAttempts = 0;
      retryDuration = 0;
    });

    it('should handle error retries with default options', (done) => {
      const queryFn = () => {
        calls++;
        throw new Error('Retry');
      };
      const options: GetQueryOptions<number> = {
        initialData: 0,
        queryFn,
        queryKey: '0',
        maxRetryAttempts,
        retryDuration,
      };
      bloc = new QueryBloc<number>(
        {
          status: 'isInitial',
          lastUpdatedAt: Date.now(),
          isInitial: true,
          isLoading: false,
          isFetching: false,
          isError: false,
          isReady: true,
          data: 0,
        },
        options
      );

      const states: QueryState<number>[] = [];

      expect(bloc).toBeDefined();
      expect(bloc.state.data).toBe(0);

      bloc
        .getQuery()
        .pipe(take(2))
        .subscribe({
          next: (state) => states.push(state),
          complete: () => {
            const [a, b] = states;
            expect(calls).toBe(2);
            expect(a.status).toBe('isFetching');
            expect(b.status).toBe('isError');
            done();
          },
        });
    });

    it('should handle error retries with custom maxRetryAttempt', (done) => {
      const queryFn = () => {
        calls++;
        throw new Error('Retry');
      };

      maxRetryAttempts = 2;
      const options: GetQueryOptions<number> = {
        initialData: 0,
        queryFn,
        queryKey: '0',
        maxRetryAttempts,
        retryDuration,
      };
      bloc = new QueryBloc<number>(
        {
          status: 'isInitial',
          lastUpdatedAt: Date.now(),
          isInitial: true,
          isLoading: false,
          isFetching: false,
          isError: false,
          isReady: true,
          data: 0,
        },
        options
      );

      const states: QueryState<number>[] = [];

      expect(bloc).toBeDefined();
      expect(bloc.state.data).toBe(0);

      bloc
        .getQuery()
        .pipe(take(2))
        .subscribe({
          next: (state) => states.push(state),
          complete: () => {
            const [a, b] = states;
            expect(calls).toBe(maxRetryAttempts + 1);
            expect(a.status).toBe('isFetching');
            expect(b.status).toBe('isError');
            done();
          },
        });
    });

    it('should disable retry if maxAttempts is set to 0', (done) => {
      const queryFn = () => {
        calls++;
        throw new Error('Retry');
      };

      maxRetryAttempts = 0;
      const options: GetQueryOptions<number> = {
        initialData: 0,
        queryFn,
        queryKey: '0',
        maxRetryAttempts,
        retryDuration,
      };
      bloc = new QueryBloc<number>(
        {
          status: 'isInitial',
          lastUpdatedAt: Date.now(),
          isInitial: true,
          isLoading: false,
          isFetching: false,
          isError: false,
          isReady: true,
          data: 0,
        },
        options
      );

      const states: QueryState<number>[] = [];

      expect(bloc).toBeDefined();
      expect(bloc.state.data).toBe(0);

      bloc
        .getQuery()
        .pipe(take(2))
        .subscribe({
          next: (state) => states.push(state),
          complete: () => {
            const [a, b] = states;
            expect(calls).toBe(maxRetryAttempts + 1);
            expect(a.status).toBe('isFetching');
            expect(b.status).toBe('isError');
            done();
          },
        });
    });

    it('should handle error retries with custom retryDuration', (done) => {
      const queryFn = () => {
        calls++;
        throw new Error('Retry');
      };

      maxRetryAttempts = 2;
      retryDuration = 2000;

      const options: GetQueryOptions<number> = {
        initialData: 0,
        queryFn,
        queryKey: '0',
        maxRetryAttempts,
        retryDuration,
      };
      bloc = new QueryBloc<number>(
        {
          status: 'isInitial',
          lastUpdatedAt: Date.now(),
          isInitial: true,
          isLoading: false,
          isFetching: false,
          isError: false,
          isReady: true,
          data: 0,
        },
        options
      );

      const states: QueryState<number>[] = [];

      expect(bloc).toBeDefined();
      expect(bloc.state.data).toBe(0);

      const startTime: number = Date.now();
      bloc
        .getQuery()
        .pipe(take(2))
        .subscribe({
          next: (state) => states.push(state),
          complete: () => {
            const duration = Date.now() - startTime;
            const [a, b] = states;
            expect(calls).toBe(maxRetryAttempts + 1);
            expect(a.status).toBe('isFetching');
            expect(b.status).toBe('isError');
            expect(duration).toBeGreaterThan(retryDuration * maxRetryAttempts);
            done();
          },
        });
    });

    it('should handle error retries with custom scalingDuration', (done) => {
      const queryFn = () => {
        calls++;
        throw new Error('Retry');
      };

      maxRetryAttempts = 3;
      const scalingDuration = 2000;

      const options: GetQueryOptions<number> = {
        initialData: 0,
        queryFn,
        queryKey: '0',
        maxRetryAttempts,
        retryDuration,
        scalingDuration,
      };
      bloc = new QueryBloc<number>(
        {
          status: 'isInitial',
          lastUpdatedAt: Date.now(),
          isInitial: true,
          isLoading: false,
          isFetching: false,
          isError: false,
          isReady: true,
          data: 0,
        },
        options
      );

      const states: QueryState<number>[] = [];

      expect(bloc).toBeDefined();
      expect(bloc.state.data).toBe(0);

      const startTime: number = Date.now();
      bloc
        .getQuery()
        .pipe(take(2))
        .subscribe({
          next: (state) => states.push(state),
          complete: () => {
            const duration = Date.now() - startTime;
            const [a, b] = states;
            expect(calls).toBe(maxRetryAttempts + 1);
            expect(a.status).toBe('isFetching');
            expect(b.status).toBe('isError');
            expect(duration).toBeGreaterThan(12000);
            done();
          },
        });
    }, 13000);
  });

  describe('abortSignal', () => {
    it('should abort a signal after a fetch event', async () => {
      const queryFn = () => {
        return Promise.resolve(1);
      };
      const options: GetQueryOptions<number> = {
        queryFn,
        queryKey: 'test',
      };

      const bloc = new QueryBloc<number>(
        {
          status: 'isLoading',
          lastUpdatedAt: Date.now(),
          isInitial: false,
          isLoading: true,
          isFetching: true,
          isError: false,
          isReady: false,
        },
        options
      );

      bloc.getQuery();

      const abortController = new AbortController();
      const signal = abortController.signal;

      expect(signal.aborted).toBe(false);

      bloc.add(new QueryFetchEvent(abortController));
      bloc.add(new QueryFetchEvent(new AbortController()));

      await delay(1000);
      expect(signal.aborted).toBe(true);
    });
  });

  describe('setQueryData', () => {
    it('should throw an error if using set callback and no data exists', (done) => {
      expect.assertions(3);
      config.onUnhandledError = (e) => {
        console.log(e);
        expect(e).toBeInstanceOf(SetQueryDataException);
        done();
      };

      const queryFn = () => {
        return Promise.resolve(1);
      };
      const options: GetQueryOptions<number> = {
        queryFn,
        queryKey: '0',
      };

      const bloc = new QueryBloc<number>(
        {
          status: 'isLoading',
          lastUpdatedAt: Date.now(),
          isInitial: false,
          isLoading: true,
          isFetching: true,
          isError: false,
          isReady: false,
        },
        options
      );

      const states: QueryState<number>[] = [];

      bloc
        .getQuery()
        .pipe(take(2))
        .subscribe({
          next: (state) => states.push(state),
          complete: () => {
            const [a, b] = states;
            expect(a.status).toBe('isLoading');
            expect(b.status).toBe('isReady');
          },
        });

      bloc.setQueryData(() => 5);
    });
  });
});
