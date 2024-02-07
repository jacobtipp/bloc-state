import { take, config, switchMap } from 'rxjs';
import { Bloc, Transition, isBlocInstance } from '../src';
import { CounterBloc } from './helpers/counter/counter.bloc';
import { CounterCubit } from './helpers/counter/counter.cubit';
import {
  CounterIncrementEvent,
  CounterDecrementEvent,
  CounterNoRegistrationEvent,
} from './helpers/counter/counter.event';
import {
  SeededCounterBloc,
  SeedEvent,
} from './helpers/counter/counter.seeded.bloc';
import { CounterState } from './helpers/counter/counter.state';
import { delay } from './helpers/delay';
import {
  EventTransformerBloc,
  GlobalEventTransformerBloc,
  restartable,
} from './helpers/transformer/transformer.bloc';
import {
  EventTransformerRestartableEvent,
  SecondEventTransformerRestartableEvent,
} from './helpers/transformer/transformer.event';

describe('bloc', () => {
  let bloc: CounterBloc;

  beforeEach(() => {
    bloc = new CounterBloc();
  });

  it('should be defined', () => {
    expect.assertions(1);
    expect(bloc).toBeDefined();
  });

  it('should throw an error if trying to add an event that is not registered', () => {
    expect.assertions(1);
    expect(() => {
      bloc.add(new CounterNoRegistrationEvent());
    }).toThrow();
  });

  it('should map events to state', (done) => {
    expect.assertions(4);
    const states: CounterState[] = [];
    bloc.state$.pipe(take(4)).subscribe({
      next: (state) => states.push(state),
      complete: () => {
        const [first, second, third, fourth] = states;
        expect(first.data).toBe(1);
        expect(second.data).toBe(2);
        expect(third.data).toBe(3);
        expect(fourth.data).toBe(2);
        bloc.close();
        done();
      },
    });
    bloc.add(new CounterIncrementEvent());
    bloc.add(new CounterIncrementEvent());
    bloc.add(new CounterIncrementEvent());
    bloc.add(new CounterDecrementEvent());
  });

  it('global event transformer should work', async () => {
    expect.assertions(3);
    const transformerBloc = new GlobalEventTransformerBloc();
    const states: number[] = [];
    transformerBloc.state$.subscribe({
      next: (state) => states.push(state),
    });

    expect(states.length).toBe(0);
    transformerBloc.add(new EventTransformerRestartableEvent());
    transformerBloc.add(new SecondEventTransformerRestartableEvent(4));
    transformerBloc.add(new EventTransformerRestartableEvent());
    transformerBloc.add(new EventTransformerRestartableEvent());
    transformerBloc.add(new SecondEventTransformerRestartableEvent(2));
    await delay(600);
    const [first] = states;
    expect(states.length).toBe(1);
    expect(first).toBe(-2);
  });

  it('should throw when providing a transformer for invididuals events along with a bloc-level event transformer', () => {
    expect.assertions(1);
    class TestEvent {}

    class TestBloc extends Bloc<TestEvent, null> {
      constructor() {
        super(null, { transformer: restartable() });

        this.on(
          TestEvent,
          (_event, _emit) => {
            return;
          },
          restartable()
        );

        this.on(TestEvent, (_event, _emit) => {
          return;
        });
      }
    }

    expect(() => new TestBloc()).toThrowError(
      "Can't provide a transformer for invididuals events along with a bloc-level event transformer"
    );
  });

  describe('Bloc.on', () => {
    it('should work without optional config', () => {
      expect.assertions(1);
      type TestStatus = 'initial' | 'loading' | 'ready' | 'failed';

      class TestState {
        constructor(public data: null, public status: TestStatus = 'initial') {}

        ready(data?: null) {
          return new TestState(data ?? this.data, 'ready');
        }

        loading() {
          return new TestState(this.data, 'loading');
        }

        failed() {
          return new TestState(this.data, 'failed');
        }
      }

      class TestEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(new TestState(null));

          this.on(TestEvent, (_event, emit) => {
            emit(this.state.ready());
          });
        }
      }

      let testState: TestState;
      const testBloc = new TestBloc();
      testBloc.state$.pipe(take(1)).subscribe({
        next: (state) => (testState = state),
        complete: () => {
          expect(testState).toBeDefined();
          testBloc.close();
        },
      });
      testBloc.add(new TestEvent());
    });

    it('should close the emitter when an event is canceled', (done) => {
      class CounterIncrement {
        protected _!: void;
      }
      class TestCounterBloc extends Bloc<CounterIncrement, number> {
        private invokeCount = 0;
        constructor() {
          super(0);

          this.on(
            CounterIncrement,
            async (_event, emit) => {
              if (this.invokeCount > 0) return;
              this.invokeCount++;
              expect(emit.isClosed).toBeFalsy();
              this.add(new CounterIncrement());
              await delay(1000);
              expect(emit.isClosed).toBeTruthy();
              done();
            },
            (events$, mapper) => events$.pipe(switchMap(mapper))
          );
        }
      }

      const testBloc = new TestCounterBloc();

      testBloc.add(new CounterIncrement());
    });

    it('should throw an error if attempting to subscribe to the same event more than once', () => {
      expect.assertions(1);
      class TestEvent {}

      class TestBloc extends Bloc<TestEvent, null> {
        constructor() {
          super(null);

          this.on(TestEvent, (_event, _emit) => {
            return;
          });

          this.on(TestEvent, (_event, _emit) => {
            return;
          });
        }
      }

      expect(() => new TestBloc()).toThrowError(
        'TestEvent can only have one EventHandler'
      );
    });

    it('should throw an error if attempting to subscribe to an event that already has a BaseEvent', () => {
      expect.assertions(1);
      abstract class TestEvent {
        protected _!: void;
      }

      class TestChildEvent extends TestEvent {}

      class TestBloc extends Bloc<TestEvent, null> {
        constructor() {
          super(null);

          this.on(TestEvent, (_event, _emit) => {
            return;
          });

          this.on(TestChildEvent, (_event, _emit) => {
            return;
          });
        }
      }

      expect(() => new TestBloc()).toThrowError(
        'TestChildEvent can only have one EventHandler per hierarchy'
      );
    });

    it('should handle multiple child events under a single parent event handler', () => {
      expect.assertions(3);
      abstract class TestEvent {
        protected _!: void;
      }

      class TestChildEvent extends TestEvent {}
      class TestGrandChildEvent extends TestChildEvent {}

      class TestBloc extends Bloc<TestEvent, string> {
        constructor() {
          super('none');

          this.on(TestEvent, (event, emit) => {
            if (event instanceof TestGrandChildEvent) {
              emit('grandchild');
              return;
            }
            if (event instanceof TestChildEvent) {
              emit('child');
              return;
            }
          });
        }
      }

      const bloc = new TestBloc();
      const states: string[] = [];
      bloc.state$.subscribe((state) => states.push(state));
      bloc.add(new TestGrandChildEvent());
      bloc.add(new TestChildEvent());
      delay(1000);
      expect(states.length).toBe(2);
      expect(states[0]).toBe('grandchild');
      expect(states[1]).toBe('child');
    });

    it('should use optional event transformer', async () => {
      expect.assertions(3);
      const transformerBloc = new EventTransformerBloc();
      const states: number[] = [];
      transformerBloc.state$.subscribe({
        next: (state) => states.push(state),
      });

      expect(states.length).toBe(0);
      transformerBloc.add(new EventTransformerRestartableEvent());
      transformerBloc.add(new EventTransformerRestartableEvent());
      transformerBloc.add(new EventTransformerRestartableEvent());
      transformerBloc.add(new EventTransformerRestartableEvent());
      transformerBloc.add(new EventTransformerRestartableEvent(2));
      await delay(600);
      const [first] = states;
      expect(states.length).toBe(1);
      expect(first).toBe(2);
    });

    it('should emit initial state only once', () => {
      expect.assertions(2);
      let errors: Error[] = [];

      let states: CounterState[] = [];

      class EmitTestBloc extends SeededCounterBloc {
        protected override onError(error: Error): void {
          errors.push(error);
          super.onError(error);
        }
      }

      const emitBloc = new EmitTestBloc();
      emitBloc.state$.subscribe(states.push.bind(states));

      emitBloc.add(new SeedEvent());
      emitBloc.add(new SeedEvent());

      const [a] = states;
      expect(states.length).toBe(1);
      expect(a.data).toBe(0);

      // close
      errors = [];
      states = [];
      emitBloc.close();
    });
  });

  describe('Bloc.onError', () => {
    it('should be invoked when an error is thrown from Bloc.onEvent', (done) => {
      expect.assertions(2);
      class TestEvent {}

      class TestBloc extends Bloc<TestEvent, null> {
        constructor() {
          super(null);
          this.on(TestEvent, (_event, _emit) => {
            return;
          });
        }

        protected override onEvent(_event: TestEvent): void {
          throw new Error('onevent error');
        }

        protected override onError(error: Error): void {
          expect(error.message).toBe('onevent error');
        }
      }

      const testBloc = new TestBloc();
      testBloc.state$.subscribe({ complete: () => done() });
      try {
        testBloc.add(new TestEvent());
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
      testBloc.close();
    });

    it('should be invoked when an error is thrown inside an event handler', (done) => {
      expect.assertions(2);

      config.onUnhandledError = (err: any) => {
        expect(err).toBeInstanceOf(Error);
        done();
      };

      class TestEvent {}

      class TestBloc extends Bloc<TestEvent, null> {
        constructor() {
          super(null);
          this.on(TestEvent, (_event, _emit) => {
            throw new Error('eventhandler error');
          });
        }

        protected override onError(error: Error): void {
          expect(error.message).toBe('eventhandler error');
          bloc.close();
        }
      }

      const testBloc = new TestBloc();
      testBloc.add(new TestEvent());
    });

    it('should be invoked when an error is thrown from onTransition', (done) => {
      expect.assertions(1);
      type TestStatus = 'initial' | 'loading' | 'ready' | 'failed';

      class TestState {
        constructor(public data: null, public status: TestStatus = 'initial') {}

        ready(data?: null) {
          return new TestState(data ?? this.data, 'ready');
        }

        loading() {
          return new TestState(this.data, 'loading');
        }

        failed() {
          return new TestState(this.data, 'failed');
        }
      }

      class TestEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(new TestState(null));
          this.on(TestEvent, (_event, emit) => {
            try {
              emit(this.state.loading());
            } catch (e) {
              /* empty */
            }
          });
        }

        protected override onTransition(
          _transition: Transition<TestEvent, TestState>
        ): void {
          throw new Error('ontransition error');
        }

        protected override onError(error: Error): void {
          expect(error.message).toBe('ontransition error');
          bloc.close();
          done();
        }
      }

      const testBloc = new TestBloc();
      testBloc.add(new TestEvent());
    });

    it('should handle fromJson', () => {
      class CounterCubitWithJson extends CounterCubit {
        constructor(state: number) {
          super(state);
        }
        override fromJson(json: string): number {
          return super.fromJson(json);
        }
      }

      const cubit = new CounterCubitWithJson(0);

      const state = cubit.fromJson('1');

      expect(state).toBe(1);

      cubit.close();
    });

    it('should handle toJson', () => {
      class CounterCubitWithJson extends CounterCubit {
        constructor(state: number) {
          super(state);
        }
        override toJson(number: number): string {
          return super.toJson(number);
        }
      }

      const cubit = new CounterCubitWithJson(0);

      const state = cubit.toJson(0);

      expect(state).toBe('0');

      cubit.close();
    });
  });

  describe('Bloc.ignoreListeners', () => {
    it('should not ignoreListeners by default', () => {
      expect(Bloc.ignoreListeners).toBe(false);
    });
  });

  describe('isBlocInstance', () => {
    it('should return true if provided an instance of a bloc', () => {
      expect.assertions(2);
      expect(isBlocInstance(bloc)).toBe(true);
      const cubit = new CounterCubit(0);
      expect(isBlocInstance(cubit)).toBe(false);
    });
  });
});
