import { Bloc } from '@jacobtipp/bloc';
import { ReplayEvent, WithReplayBloc } from '../src';

describe('ReplayBloc', () => {
  class CounterEvent extends ReplayEvent {}

  class Increment extends CounterEvent {}

  class CounterBlocBase extends Bloc<CounterEvent, number> {
    constructor(state: number, name?: string) {
      super(state, { name: name });

      this.on(Increment, (_event, emit) => {
        emit(this.state + 1);
      });
    }
  }

  class CounterBloc extends WithReplayBloc(CounterBlocBase) {}

  it('should support undo', () => {
    const bloc = new CounterBloc(0);
    expect(bloc.state).toBe(0);
    expect(bloc.canUndo).toBe(false);
    bloc.add(new Increment());
    expect(bloc.state).toBe(1);
    expect(bloc.canUndo).toBe(true);
    bloc.undo();
    expect(bloc.state).toBe(0);
    bloc.close();
  });

  it('should support redo', () => {
    const bloc = new CounterBloc(0);
    expect(bloc.state).toBe(0);
    bloc.add(new Increment());
    expect(bloc.state).toBe(1);
    expect(bloc.canUndo).toBe(true);
    bloc.undo();
    expect(bloc.state).toBe(0);

    expect(bloc.canRedo).toBe(true);
    bloc.redo();
    expect(bloc.state).toBe(1);

    bloc.close();
  });

  it('should not add a new change if limit is 0', () => {
    class CounterBloc extends WithReplayBloc(CounterBlocBase) {
      constructor(state: number, limit: number) {
        super(state);
        this.limit = limit;
      }
    }

    const bloc = new CounterBloc(0, 0);
    expect(bloc.state).toBe(0);
    expect(bloc.canUndo).toBe(false);
    bloc.add(new Increment());
    expect(bloc.state).toBe(1);
    expect(bloc.canUndo).toBe(false);

    bloc.close();
  });

  it('should clear history', () => {
    const bloc = new CounterBloc(0);
    expect(bloc.state).toBe(0);
    bloc.add(new Increment());
    bloc.add(new Increment());
    expect(bloc.state).toBe(2);
    bloc.undo();
    expect(bloc.canRedo).toBe(true);
    expect(bloc.canUndo).toBe(true);
    bloc.clearHistory();
    expect(bloc.canRedo).toBe(false);
    expect(bloc.canUndo).toBe(false);

    bloc.close();
  });

  it('should undo/limit until limit is reached', () => {
    class CounterBloc extends WithReplayBloc(CounterBlocBase) {
      constructor(state: number, limit: number) {
        super(state);
        this.limit = limit;
      }
    }

    const bloc = new CounterBloc(0, 3);
    bloc.add(new Increment());
    bloc.add(new Increment());
    bloc.add(new Increment());
    bloc.add(new Increment());
    bloc.add(new Increment());
    expect(bloc.state).toBe(5);
    bloc.undo();
    bloc.undo();
    bloc.undo();
    expect(bloc.state).toBe(2);
    bloc.undo();
    expect(bloc.state).toBe(2);
    bloc.redo();
    bloc.redo();
    bloc.redo();
    expect(bloc.state).toBe(5);

    bloc.close();
  });

  it('should only undo/redo if shouldReplay is true', () => {
    class CounterBloc extends WithReplayBloc(CounterBlocBase) {
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
    }

    const bloc = new CounterBloc(0, 3, (state) => state % 2 === 0);
    bloc.add(new Increment());
    bloc.add(new Increment());
    bloc.add(new Increment());
    bloc.add(new Increment());
    bloc.add(new Increment());
    expect(bloc.state).toBe(5);
    bloc.undo();
    bloc.undo();
    expect(bloc.state).toBe(2);
    bloc.undo();
    expect(bloc.state).toBe(2);
    bloc.redo();
    expect(bloc.state).toBe(4);
    bloc.redo();
    expect(bloc.state).toBe(4);

    bloc.close();
  });
});
