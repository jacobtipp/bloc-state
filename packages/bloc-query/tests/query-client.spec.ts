import {
  GetQueryOptions,
  QueryClient,
  QueryNotFoundException,
} from '../src/lib';
import { filter, take } from 'rxjs';
import { delay } from './helpers/delay';
import { getRandomInt } from './helpers/random';
import { QueryState } from '../src/lib/query-state';
import { TestApiError } from './helpers/test-error';
import { Bloc, BlocBase, BlocObserver } from '@jacobtipp/bloc';

describe('QueryClient', () => {
  const queryClient = new QueryClient();

  describe('getQuery', () => {
    afterEach(() => {
      queryClient.clear();
    });

    it('it should handle a selector', (done) => {
      const states: string[] = [];
      queryClient
        .getQuery({
          queryKey: 'person',
          queryFn: () => {
            return Promise.resolve({
              person: {
                name: 'bob',
                age: 21,
              },
            });
          },
          selector: (state) => state.data.person.name,
        })
        .pipe(take(1))
        .subscribe({
          next: (state) => states.push(state),
          complete: () => {
            const [a] = states;
            expect(states.length).toBe(1);
            expect(a).toBe('bob');
            done();
          },
        });
    });

    it('it should log errors to BlocObserver if logErrors option is enabled', (done) => {
      class TestObserver extends BlocObserver {
        override onError(_bloc: BlocBase<any>, error: Error): void {
          expect(error.message).toBe('Selector Failure');
          done();
        }
      }

      Bloc.observer = new TestObserver();
      queryClient
        .getQuery({
          logErrors: true,
          queryKey: 'person',
          queryFn: () => {
            throw new Error('Selector Failure');
            return Promise.resolve({
              person: {
                name: 'bob',
                age: 21,
              },
            });
          },
          selector: (state) => state.data.person.name,
        })
        .pipe(take(1))
        .subscribe();
    });

    it('it should return a stream error if QueryState failed', (done) => {
      const states: string[] = [];
      queryClient
        .getQuery({
          logErrors: true,
          queryKey: 'person',
          queryFn: () => {
            throw new Error('Selector Failure');
            return Promise.resolve({
              person: {
                name: 'bob',
                age: 21,
              },
            });
          },
          selector: (state) => state.data.person.name,
        })
        .pipe(take(1))
        .subscribe({
          next: (state) => states.push(state),
          error: (error: Error) => {
            expect(error.message).toBe('Selector Failure');
            done();
          },
        });
    });

    it('it should emit multiple states when no comparator is provided even if nested data has not changed', (done) => {
      type Person = { name: string; age: number };
      const states: Person[] = [];
      queryClient
        .getQuery({
          queryKey: 'person',
          queryFn: () => {
            return Promise.resolve({
              person: {
                name: 'bob',
                age: 21,
              },
            });
          },
          selector: (state) => state.data.person,
        })
        .pipe(take(2))
        .subscribe({
          next: (state) => {
            states.push(state);
          },
          complete: () => {
            const [a, b] = states;
            expect(states.length).toBe(2);
            expect(a).not.toBe(b);
            done();
          },
        });

      setTimeout(
        () =>
          queryClient.revalidateQueries({
            queryKey: 'person',
          }),
        1000
      );
    });

    it('it should emit only once with a comparator function, if two emissions have the same nested data', (done) => {
      type Person = { name: string; age: number };
      const states: Person[] = [];
      let calls = 0;
      queryClient
        .getQuery({
          queryKey: 'person',
          queryFn: () => {
            calls++;
            return Promise.resolve({
              person: {
                name: 'bob',
                age: 21,
              },
            });
          },
          selector: (state) => state.data.person,
          comparator: (previous, current) => {
            return previous.age === current.age;
          },
        })
        .subscribe({
          next: (state) => {
            states.push(state);
          },
          complete: () => {
            expect(states.length).toBe(1);
            expect(calls).toBe(3);
            done();
          },
        });

      setTimeout(
        () =>
          queryClient.revalidateQueries({
            queryKey: 'person',
          }),
        1000
      );

      setTimeout(
        () =>
          queryClient.revalidateQueries({
            queryKey: 'person',
          }),
        2000
      );

      setTimeout(() => queryClient.removeQuery('person'), 2500);
    });

    it('it should handle concurrent subscriptions without triggering multiple revalidations with initial data', (done) => {
      const options: GetQueryOptions<number> = {
        initialData: 0,
        queryKey: 'count',
        queryFn: () => {
          return Promise.resolve(getRandomInt(1, 10));
        },
      };

      const states: QueryState<number>[] = [];
      queryClient
        .getQuery(options)
        .pipe(take(2))
        .subscribe({
          next: (state) => states.push(state),
          complete: () => {
            const [a, b] = states;
            expect(states.length).toBe(2);
            expect(a.status).toBe('isFetching');
            expect(b.status).toBe('isReady');
            done();
          },
        });
      queryClient.getQuery(options);
      queryClient.getQuery(options);
      queryClient.getQuery(options);
      queryClient.getQuery(options);
    });

    it('it should handle concurrent subscriptions without triggering multiple revalidations without initial data', (done) => {
      const options: GetQueryOptions<number> = {
        queryKey: 'count',
        queryFn: () => {
          return Promise.resolve(getRandomInt(1, 10));
        },
      };

      const states: QueryState<number>[] = [];
      queryClient
        .getQuery(options)
        .pipe(take(2))
        .subscribe({
          next: (state) => states.push(state),
          complete: () => {
            const [a, b] = states;
            expect(states.length).toBe(2);
            expect(a.status).toBe('isLoading');
            expect(b.status).toBe('isReady');
            done();
          },
        });
      queryClient.getQuery(options);
      queryClient.getQuery(options);
      queryClient.getQuery(options);
      queryClient.getQuery(options);
    });

    it('it should handle an initial query subscription with initial data and no staleTime defined', (done) => {
      const options: GetQueryOptions<number> = {
        initialData: 0,
        queryKey: 'count',
        queryFn: () => Promise.resolve(getRandomInt(1, 10)),
      };

      const states: QueryState<number>[] = [];

      queryClient
        .getQuery(options)
        .pipe(take(2))
        .subscribe({
          next: (state) => {
            states.push(state);
          },
          complete: () => {
            const [a, b] = states;
            expect(a.status).toBe('isFetching');
            expect(a.data).toBe(0);
            expect(b.status).toBe('isReady');
            expect(b.data).toBeDefined();
            expect(a.data).not.toBe(b.data);
            expect(typeof b.data).toBe('number');
            done();
          },
        });
    });

    it('it should handle an initial query subscription with no initialData', (done) => {
      const options: GetQueryOptions<number> = {
        queryKey: 'count',
        queryFn: () => Promise.resolve(getRandomInt(1, 10)),
      };

      const states: QueryState<number>[] = [];

      queryClient
        .getQuery(options)
        .pipe(take(2))
        .subscribe({
          next: (state) => {
            states.push(state);
          },
          complete: () => {
            const [a, b] = states;
            expect(a.status).toBe('isLoading');
            expect(a.data).toBeUndefined();
            expect(b.status).toBe('isReady');
            expect(b.data).toBeDefined();
            expect(typeof b.data).toBe('number');
            done();
          },
        });
    });

    it('it should handle an initial query subscription with initial data and a staleTime defined', async () => {
      const options: GetQueryOptions<number> = {
        initialData: 0,
        staleTime: 3000,
        queryKey: 'count',
        queryFn: () => Promise.resolve(getRandomInt(1, 10)),
      };

      const states: QueryState<number>[] = [];

      await queryClient
        .getQuery(options)
        .pipe(take(1))
        .forEach((state) => {
          states.push(state);
        });

      const [a] = states;
      expect(a.status).toBe('isInitial');
      expect(a.data).toBe(0);

      await delay(3001);

      await queryClient
        .getQuery(options)
        .pipe(take(2))
        .forEach((state) => {
          states.push(state);
        });

      const [_b, c, d] = states;

      expect(c.status).toBe('isFetching');
      expect(d.status).toBe('isReady');
      expect(c.data).not.toBe(d.data);
    });
  });

  describe('revalidateQueries', () => {
    it('it should revalidate all queries in a queryClient if no predicate or queryKey is provided', async () => {
      const options1: GetQueryOptions<number> = {
        queryKey: 'user',
        queryFn: () => Promise.resolve(getRandomInt(1, 9999999)),
      };

      const options2: GetQueryOptions<number> = {
        queryKey: 'id',
        queryFn: () => Promise.resolve(getRandomInt(1, 9999999)),
      };

      const queryClient = new QueryClient();

      queryClient.getQuery(options1);
      queryClient.getQuery(options2);

      await delay(1000);
      expect(queryClient.getQueryKeys().length).toBe(2);

      const data1 = queryClient.getQueryData<number>(options1.queryKey);
      const data2 = queryClient.getQueryData<number>(options2.queryKey);

      queryClient.revalidateQueries();

      await delay(1000);
      const newData1 = queryClient.getQueryData<number>(options1.queryKey);
      const newData2 = queryClient.getQueryData<number>(options2.queryKey);

      expect(data1).not.toBe(newData1);
      expect(data2).not.toBe(newData2);
    });

    it('it should revalidate all queries in a queryClient if queryKey is provided', async () => {
      const options1: GetQueryOptions<number> = {
        queryKey: 'user',
        staleTime: 10000,
        queryFn: () => Promise.resolve(getRandomInt(1, 9999999)),
      };

      const options2: GetQueryOptions<number> = {
        queryKey: 'id',
        staleTime: 10000,
        queryFn: () => Promise.resolve(getRandomInt(1, 9999999)),
      };

      const queryClient = new QueryClient();

      queryClient.getQuery(options1);
      queryClient.getQuery(options2);

      await delay(1000);
      expect(queryClient.getQueryKeys().length).toBe(2);

      const data1 = await queryClient.getQueryData<number>(options1.queryKey);
      const data2 = await queryClient.getQueryData<number>(options2.queryKey);

      queryClient.revalidateQueries({
        queryKey: options1.queryKey,
      });

      await delay(1000);
      const newData1 = await queryClient.getQueryData<number>(
        options1.queryKey
      );
      const newData2 = await queryClient.getQueryData<number>(
        options2.queryKey
      );

      expect(data1).not.toBe(newData1);
      expect(data2).toBe(newData2);
    });

    it('it should revalidate all queries in a queryClient that match a queryKey', async () => {
      const options1: GetQueryOptions<number> = {
        queryKey: 'user',
        queryFn: () => Promise.resolve(getRandomInt(1, 9999999)),
      };

      const options2: GetQueryOptions<number> = {
        queryKey: 'id',
        queryFn: () => Promise.resolve(getRandomInt(1, 9999999)),
      };

      const queryClient = new QueryClient();

      queryClient.getQuery(options1);
      queryClient.getQuery(options2);

      await delay(1000);
      expect(queryClient.getQueryKeys().length).toBe(2);

      const data1 = queryClient.getQueryData<number>(options1.queryKey);
      const data2 = queryClient.getQueryData<number>(options2.queryKey);

      queryClient.revalidateQueries({
        predicate: (key) => key === 'user' || key === 'id',
      });

      await delay(1000);
      const newData1 = queryClient.getQueryData<number>(options1.queryKey);
      const newData2 = queryClient.getQueryData<number>(options2.queryKey);

      expect(data1).not.toBe(newData1);
      expect(data2).not.toBe(newData2);
    });
  });

  describe('getQueryData', () => {
    it('it should return data from async query functions', async () => {
      const options: GetQueryOptions<number> = {
        queryKey: 'count',
        queryFn: async () => {
          await delay(1000);
          return Promise.resolve(1);
        },
      };

      const queryClient = new QueryClient();

      queryClient.getQuery(options);

      expect(await queryClient.getQueryData<number>(options.queryKey)).toBe(1);

      queryClient.clear();
    });

    it('it should reject with an error if an error is thrown', async () => {
      const options: GetQueryOptions<number> = {
        queryKey: 'count',
        queryFn: async () => {
          await delay(1000);
          throw new TestApiError('Test Error');
        },
      };

      const queryClient = new QueryClient();

      queryClient.getQuery(options);

      try {
        await queryClient.getQueryData<number>(options.queryKey);
      } catch (e) {
        expect(e).toBeInstanceOf(TestApiError);
      }

      queryClient.clear();
    });

    it('it should throw a QueryNotFoundException if a query does not exist', async () => {
      const options: GetQueryOptions<number> = {
        queryKey: 'count',
        queryFn: async () => {
          await delay(1000);
          return Promise.resolve(1);
        },
      };

      const queryClient = new QueryClient();

      await expect(
        queryClient.getQueryData<number>(options.queryKey)
      ).rejects.toThrow(QueryNotFoundException);
    });

    it('it should accept a query as an argument', async () => {
      const queryClient = new QueryClient();

      const one: GetQueryOptions<number> = {
        queryKey: 'one',
        queryFn: async () => {
          await delay(1000);
          return Promise.resolve(1);
        },
      };

      const queryOne = queryClient.getQuery(one);

      const two: GetQueryOptions<number> = {
        queryKey: 'two',
        queryFn: async () => {
          const one = await queryClient.getQueryData<number>(queryOne);
          return Promise.resolve(one + 1);
        },
      };

      queryClient.getQuery(two);

      expect(await queryClient.getQueryData<number>('two')).toBe(2);
    });
  });

  describe('setQuery', () => {
    it('it should set a new query value with set callback', (done) => {
      const options: GetQueryOptions<{ count: number }> = {
        initialData: { count: 0 },
        staleTime: 3000,
        queryKey: 'count',
        queryFn: () => Promise.resolve({ count: getRandomInt(1, 10) }),
      };

      const queryClient = new QueryClient();

      const states: QueryState<{ count: number }>[] = [];

      queryClient
        .getQuery(options)
        .pipe(take(2))
        .subscribe({
          next: (state) => {
            states.push(state);
          },
          complete: () => {
            const [a, b] = states;
            expect(a.status).toBe('isInitial');
            expect(a.data?.count).toBe(0);
            expect(b.status).toBe('isReady');
            expect(b.data?.count).toBe(5);
            done();
          },
        });

      queryClient.setQueryData<{ count: number }>(options.queryKey, (old) => ({
        ...old,
        count: 5,
      }));
    });

    it('it should set a new query value with data', (done) => {
      const options: GetQueryOptions<{ count: number }> = {
        initialData: { count: 0 },
        staleTime: 3000,
        queryKey: 'count',
        queryFn: () => Promise.resolve({ count: getRandomInt(1, 10) }),
      };

      const queryClient = new QueryClient();

      const states: QueryState<{ count: number }>[] = [];

      queryClient
        .getQuery(options)
        .pipe(take(2))
        .subscribe({
          next: (state) => {
            states.push(state);
          },
          complete: () => {
            const [a, b] = states;
            expect(a.status).toBe('isInitial');
            expect(a.data?.count).toBe(0);
            expect(b.status).toBe('isReady');
            expect(b.data?.count).toBe(5);
            done();
          },
        });

      queryClient.setQueryData<{ count: number }>(options.queryKey, {
        count: 5,
      });
    });
  });

  describe('cancelQuery', () => {
    it('it should cancel a query and revert to previous state', async () => {
      let count = 0;
      const queryClient = new QueryClient();

      const states: number[] = [];

      const getCount = () => {
        return queryClient.getQuery<number>({
          queryKey: 'count',
          queryFn: async () => {
            await delay(1000);
            return count++;
          },
        });
      };

      getCount()
        .pipe(filter((state) => state.isReady))
        .subscribe({
          next: (next) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            states.push(next.data!);
          },
        });

      await delay(1001);

      getCount();

      await delay(1001);

      getCount();
      queryClient.cancelQuery('count');

      await delay(2000);

      const [_, b, c] = states;
      expect(states.length).toBe(3);

      expect(b).toBe(c);
    });
  });

  describe('removeQuery', () => {
    it('it should remove a query', () => {
      const options: GetQueryOptions<number> = {
        initialData: 0,
        queryKey: 'count',
        queryFn: () => Promise.resolve(getRandomInt(1, 10)),
      };

      const queryClient = new QueryClient();

      queryClient.getQuery(options);

      expect(queryClient.removeQuery(options.queryKey)).toBe(true);
      expect(queryClient.removeQuery(options.queryKey)).toBe(false);
    });
  });
});
