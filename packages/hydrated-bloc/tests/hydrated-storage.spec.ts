import { Cubit, Change, Bloc } from '@jacobtipp/bloc';
import {
  StorageNotFound,
  WithHydratedBloc,
  WithHydratedCubit,
} from '../src/lib';

describe('HydratedStorage', () => {
  it('should handle StorageNotFoundError with Cubit', () => {
    let testError = '';

    class CounterCubitBase extends Cubit<number> {
      increment = () => this.emit(this.state + 1);
    }

    class CounterCubit extends WithHydratedCubit(CounterCubitBase) {
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
    expect(() => new CounterCubit(0)).toThrowError(StorageNotFound);
  });

  it('should handle StorageNotFoundError with Bloc', () => {
    let testError = '';

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
    class CounterBloc extends WithHydratedBloc(CounterBlocBase) {
      constructor(state: number) {
        super(state);
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
    expect(() => new CounterBloc(0)).toThrowError(StorageNotFound);
  });
});
