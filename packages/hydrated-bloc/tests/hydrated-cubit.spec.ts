import { Change, Cubit } from '@jacobtipp/bloc';
import { HydratedStorage, Storage, WithHydratedCubit } from '../src';

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

class CounterCubit extends WithHydratedCubit<number>(Cubit) {
  increment = () => this.emit(this.state + 1);
}

describe('hydrated-cubit', () => {
  const inMemoryStorage = new MemoryStorage();
  HydratedStorage.storage = inMemoryStorage;

  beforeEach(() => {
    inMemoryStorage.clear();
  });

  it('should persist state', () => {
    const cubit = new CounterCubit(0);
    expect(cubit.state).toBe(0);
    cubit.increment();
    expect(cubit.state).toBe(1);

    const cubitTwo = new CounterCubit(0);
    expect(cubitTwo.state).toBe(1);

    cubit.close();
    cubitTwo.close();
  });

  it('should clear storage', () => {
    const cubit = new CounterCubit(0);

    cubit.increment();
    expect(inMemoryStorage.read('CounterCubit-')).toBe('1');
    cubit.clear();
    expect(inMemoryStorage.read('CounterCubit-')).toBe(null);

    cubit.close();
  });

  it('should handle errors being thrown with fromJson', () => {
    let testError = '';

    class CounterCubit extends WithHydratedCubit<number>(Cubit) {
      increment = () => this.emit(this.state + 1);

      protected override fromJson(_json: string): number {
        throw new Error('Error was thrown');
      }

      protected override onError(error: Error): void {
        testError = error.message;
      }
    }

    const cubit = new CounterCubit(0);
    cubit.increment();

    expect(cubit.state).toBe(1);

    expect(testError).toBe('');

    const cubitTwo = new CounterCubit(0);

    expect(testError).toBe('Error was thrown');
    expect(cubitTwo.state).toBe(0);

    cubit.close();
    cubitTwo.close();
  });

  it('should handle errors being thrown with toJson in onChange', () => {
    let testError = '';

    class CounterCubit extends WithHydratedCubit<number>(Cubit) {
      increment = () => this.emit(this.state + 1);

      override hydrate(): void {
        return;
      }

      protected override toJson(_state: number): string {
        throw new Error('Error was thrown');
      }

      protected override onError(error: Error): void {
        testError = error.message;
      }
    }

    const cubit = new CounterCubit(0);
    expect(testError).toBe('');
    expect(() => cubit.increment()).toThrow();
    expect(testError).toBe('Error was thrown');

    cubit.close();
  });

  it('should handle errors being thrown with toJson in hydrate', () => {
    let testError = '';

    class CounterCubit extends WithHydratedCubit<number>(Cubit) {
      increment = () => this.emit(this.state + 1);

      protected override toJson(_state: number): string {
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
    const cubit = new CounterCubit(0);
    expect(testError).toBe('Error was thrown');

    cubit.close();
  });
});
