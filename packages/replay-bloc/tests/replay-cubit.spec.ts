import { Cubit } from '@jacobtipp/bloc';
import { WithReplayCubit } from '../src';

describe('ReplayCubit', () => {
  class CounterCubitBase extends Cubit<number> {}

  class CounterCubit extends WithReplayCubit(CounterCubitBase) {
    increment = () => this.emit(this.state + 1);
  }

  it('should support undo', () => {
    const cubit = new CounterCubit(0);
    expect(cubit.state).toBe(0);
    expect(cubit.canUndo).toBe(false);
    cubit.increment();
    expect(cubit.state).toBe(1);
    expect(cubit.canUndo).toBe(true);
    cubit.undo();
    expect(cubit.state).toBe(0);
    cubit.close();
  });

  it('should support redo', () => {
    const cubit = new CounterCubit(0);
    expect(cubit.state).toBe(0);
    cubit.increment();
    expect(cubit.state).toBe(1);
    expect(cubit.canUndo).toBe(true);
    cubit.undo();
    expect(cubit.state).toBe(0);

    expect(cubit.canRedo).toBe(true);
    cubit.redo();
    expect(cubit.state).toBe(1);

    cubit.close();
  });

  it('should not add a new change if limit is 0', () => {
    class CounterCubit extends WithReplayCubit(CounterCubitBase) {
      constructor(state: number, limit: number) {
        super(state, undefined);
        this.limit = limit;
      }
      increment = () => this.emit(this.state + 1);
    }

    const cubit = new CounterCubit(0, 0);
    expect(cubit.state).toBe(0);
    expect(cubit.canUndo).toBe(false);
    cubit.increment();
    expect(cubit.state).toBe(1);
    expect(cubit.canUndo).toBe(false);

    cubit.close();
  });

  it('should clear history', () => {
    const cubit = new CounterCubit(0);
    expect(cubit.state).toBe(0);
    cubit.increment();
    cubit.increment();
    expect(cubit.state).toBe(2);
    cubit.undo();
    expect(cubit.canRedo).toBe(true);
    expect(cubit.canUndo).toBe(true);
    cubit.clearHistory();
    expect(cubit.canRedo).toBe(false);
    expect(cubit.canUndo).toBe(false);

    cubit.close();
  });

  it('should undo/limit until limit is reached', () => {
    class CounterCubit extends WithReplayCubit(CounterCubitBase) {
      constructor(state: number, limit: number) {
        super(state, undefined);
        this.limit = limit;
      }
      increment = () => this.emit(this.state + 1);
    }

    const cubit = new CounterCubit(0, 3);
    cubit.increment();
    cubit.increment();
    cubit.increment();
    cubit.increment();
    cubit.increment();
    expect(cubit.state).toBe(5);
    cubit.undo();
    cubit.undo();
    cubit.undo();
    expect(cubit.state).toBe(2);
    cubit.undo();
    expect(cubit.state).toBe(2);
    cubit.redo();
    cubit.redo();
    cubit.redo();
    expect(cubit.state).toBe(5);

    cubit.close();
  });

  it('should only undo/redo if shouldReplay is true', () => {
    class CounterCubit extends WithReplayCubit(CounterCubitBase) {
      private _shouldReplayPredicate: (state: number) => boolean;
      constructor(
        state: number,
        limit: number,
        shouldReplay: (state: number) => boolean
      ) {
        super(state);
        (this.limit = limit), (this._shouldReplayPredicate = shouldReplay);
      }

      override shouldReplay(state: number): boolean {
        return (
          this._shouldReplayPredicate.call(this, state) ??
          super.shouldReplay(state)
        );
      }
      increment = () => this.emit(this.state + 1);
    }

    const cubit = new CounterCubit(0, 3, (state) => state % 2 === 0);
    cubit.increment();
    cubit.increment();
    cubit.increment();
    cubit.increment();
    cubit.increment();
    expect(cubit.state).toBe(5);
    cubit.undo();
    cubit.undo();
    expect(cubit.state).toBe(2);
    cubit.undo();
    expect(cubit.state).toBe(2);
    cubit.redo();
    expect(cubit.state).toBe(4);
    cubit.redo();
    expect(cubit.state).toBe(4);

    cubit.close();
  });
});
