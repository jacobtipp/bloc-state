import { Cubit, Change, Bloc } from '@jacobtipp/bloc';
import {
  StorageNotFound,
  WithHydratedBloc,
  WithHydratedCubit,
} from '../src/lib';

describe('HydratedStorage', () => {
  it('should handle StorageNotFoundError with Cubit', () => {
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
    expect(() => new CounterCubit(0)).toThrowError(StorageNotFound);
  });

  it('should handle StorageNotFoundError with Bloc', () => {
    let testError = '';

    abstract class CounterEvent {
      protected _!: void;
    }

    class Increment extends CounterEvent {}

    class CounterBloc extends WithHydratedBloc<CounterEvent, number>(Bloc) {
      constructor(state: number) {
        super(state);

        this.on(Increment, (_event, emit) => {
          emit(this.state + 1);
        });
      }

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
    expect(() => new CounterBloc(0)).toThrowError(StorageNotFound);
  });
});
