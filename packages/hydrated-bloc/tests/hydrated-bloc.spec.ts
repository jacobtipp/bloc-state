import { Bloc, Change } from '@jacobtipp/bloc';
import { HydratedStorage, Storage, WithHydratedBloc } from '../src';
import { delay } from './delay';

const cache = new Map<string, any>();

class MemoryStorage extends Storage {
  private _closed = false;
  override read(key: string) {
    if (this._closed) return null;
    return cache.get(key) ?? null;
  }
  override write(key: string, value: any): Promise<void> {
    if (this._closed) return Promise.resolve();
    cache.set(key, value);
    return Promise.resolve();
  }
  override delete(key: string): Promise<void> {
    if (this._closed) return Promise.resolve();
    cache.delete(key);
    return Promise.resolve();
  }
  override clear(): Promise<void> {
    if (this._closed) return Promise.resolve();
    cache.clear();
    return Promise.resolve();
  }
  override close(): Promise<void> {
    return this.clear();
  }
}

abstract class CounterEvent {
  protected _!: void;
}

class Increment extends CounterEvent {}

class CounterBlocBase extends Bloc<CounterEvent, number> {
  constructor(state: number) {
    super(state);

    this.on(Increment, (_event, emit) => {
      emit(this.state + 1);
    });
  }
}

describe('hydrated-bloc', () => {
  const inMemoryStorage = new MemoryStorage();
  HydratedStorage.storage = inMemoryStorage;

  beforeEach(() => {
    inMemoryStorage.clear();
  });

  it('should persist state', async () => {
    class CounterBloc extends WithHydratedBloc(CounterBlocBase) {
      constructor(state: number) {
        super(state);
        this.hydrate();
      }
    }
    const bloc = new CounterBloc(0);

    expect(bloc.state).toBe(0);
    bloc.add(new Increment());

    await delay(1000);
    expect(bloc.state).toBe(1);

    const cubitTwo = new CounterBloc(0);
    expect(cubitTwo.state).toBe(1);

    bloc.close();
    cubitTwo.close();
  });

  it('should clear storage', () => {
    class CounterBloc extends WithHydratedBloc(CounterBlocBase) {
      constructor(state: number) {
        super(state);
        this.hydrate();
      }
    }
    const bloc = new CounterBloc(0);

    bloc.add(new Increment());
    expect(inMemoryStorage.read('CounterBloc-')).toBe('1');
    bloc.clear();
    expect(inMemoryStorage.read('CounterBloc-')).toBe(null);

    bloc.close();
  });

  it('should handle errors being thrown with fromJson', async () => {
    let testError = '';

    class CounterBloc extends WithHydratedBloc(CounterBlocBase) {
      constructor(state: number) {
        super(state);
        this.hydrate();
      }

      override fromJson(_json: string): number {
        throw new Error('Error was thrown');
      }

      override onError(error: Error): void {
        testError = error.message;
      }
    }

    const bloc = new CounterBloc(0);
    bloc.add(new Increment());

    await delay(1000);
    expect(bloc.state).toBe(1);

    expect(testError).toBe('');

    const blocTwo = new CounterBloc(0);

    expect(testError).toBe('Error was thrown');
    expect(blocTwo.state).toBe(0);

    bloc.close();
    blocTwo.close();
  });

  it('should handle errors being thrown with toJson in onChange', async () => {
    let testError = '';

    class CounterBloc extends WithHydratedBloc(CounterBlocBase) {
      constructor(state: number) {
        super(state);
      }

      override hydrate(): void {
        return;
      }

      override toJson(_state: number): string {
        throw new Error('Error was thrown');
      }

      override onChange(change: Change<number>): void {
        try {
          expect(super.onChange(change)).toThrow();
        } catch (error: any) {
          return;
        }
      }

      protected override onError(error: Error): void {
        testError = error.message;
      }
    }

    const bloc = new CounterBloc(0);

    expect(testError).toBe('');
    bloc.add(new Increment());

    await delay(1000);
    expect(testError).toBe('Error was thrown');

    bloc.close();
  });

  it('should handle errors being thrown with toJson in hydrate', () => {
    let testError = '';

    class CounterBloc extends WithHydratedBloc(CounterBlocBase) {
      constructor(state: number) {
        super(state);
        this.hydrate();
      }

      override toJson(_state: number): string {
        throw new Error('Error was thrown');
      }

      protected override onError(error: Error): void {
        testError = error.message;
      }

      protected override onChange(_change: Change<number>): void {
        return;
      }
    }

    expect(testError).toBe('');
    const bloc = new CounterBloc(0);
    expect(testError).toBe('Error was thrown');

    bloc.close();
  });
});
