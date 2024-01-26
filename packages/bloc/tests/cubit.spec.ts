import { Observable, Observer, Subject, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cubit, Change, NextFunction } from '../src';
import { CounterCubit } from './helpers/counter/counter.cubit';
import { SeededCounterCubit } from './helpers/counter/counter.seeded.cubit';

describe('Cubit', () => {
  let cubit: CounterCubit;
  let state$: Observable<number>;

  beforeEach(() => {
    cubit = new CounterCubit(0);
    state$ = cubit.state$;
  });

  it('should create a new Cubit instance', () => {
    expect.assertions(1);
    expect(cubit).toBeInstanceOf(Cubit);
  });

  it('should close a cubit', () => {
    expect.assertions(2);
    expect(cubit.isClosed).toBe(false);
    cubit.close();
    expect(cubit.isClosed).toBe(true);
  });

  it('should return new state from actions', (done) => {
    expect.assertions(3);
    const states: number[] = [];
    state$.pipe(tap((state) => states.push(state))).subscribe({
      complete: () => {
        const [first, second] = states;
        expect(states.length).toBe(2);
        expect(first).toBe(1);
        expect(second).toBe(2);
        done();
      },
    });
    cubit.increment();
    cubit.increment();
    cubit.close();
  });

  it('should handle async actions', (done) => {
    expect.assertions(4);
    void (async () => {
      const states: number[] = [];
      state$.pipe(tap((state) => states.push(state))).subscribe({
        complete: () => {
          const [first, second, third] = states;
          expect(states.length).toBe(3);
          expect(first).toBe(1);
          expect(second).toBe(0);
          expect(third).toBe(1);
          done();
        },
      });
      await cubit.asyncIncrement();
      cubit.close();
    })();
  });

  describe('Cubit.onError', () => {
    let errors: Error[] = [];

    class OnChangeError extends Error {
      override message = 'onchange error';
    }

    class ErrorTestBloc extends Cubit<number> {
      constructor() {
        super(0);
      }

      triggerChange() {
        this.emit(1);
      }

      protected override onChange(_change: Change<number>): void {
        throw new OnChangeError();
      }

      protected override onError(error: Error): void {
        errors.push(error);
        super.onError(error);
      }
    }

    let errorBloc: ErrorTestBloc;

    beforeEach(() => {
      errorBloc = new ErrorTestBloc();
      errors = [];
    });

    afterEach(() => {
      errorBloc.close();
    });

    it('should be invoked when an error is thrown from BlocBase.onChange', () => {
      expect.assertions(1);
      try {
        errorBloc.triggerChange();
        // eslint-disable-next-line no-empty
      } catch (e) {}

      const [a] = errors;

      expect(a.message).toBe('onchange error');
    });

    it('should be invoked when an error is called by addError', (done) => {
      class ErroCubit extends Cubit<number> {
        trigger() {
          this.addError(new Error('Triggered'));
        }

        override onError(e: Error) {
          expect(e.message).toBe('Triggered');
          this.close();
          done();
        }
      }

      const cubit = new ErroCubit(0);
      cubit.trigger();
    });
  });

  describe('Cubit.emit', () => {
    let errors: Error[] = [];

    let states: number[] = [];

    class EmitTestBloc extends SeededCounterCubit {
      protected override onError(error: Error): void {
        errors.push(error);
        super.onError(error);
      }
    }

    let emitBloc: EmitTestBloc;

    beforeEach(() => {
      emitBloc = new EmitTestBloc(0);
      emitBloc.state$.subscribe(states.push.bind(states));
    });

    afterEach(() => {
      errors = [];
      states = [];
      emitBloc.close();
    });

    it('should warn the user when a Cubit is closed', () => {
      expect.assertions(4);

      const consoleWarn = console.warn;
      const mockWarn = jest.fn();
      console.warn = mockWarn;

      emitBloc.increment();
      emitBloc.increment();

      emitBloc.close();

      emitBloc.increment();

      const [a, b] = states;

      expect(states.length).toBe(2);
      expect(a).toBe(1);
      expect(b).toBe(2);
      expect(mockWarn).toHaveBeenCalled();

      console.warn = consoleWarn;
    });

    it('should emit states in the correct order', () => {
      expect.assertions(2);
      emitBloc.increment();
      const [a] = states;
      expect(states.length).toBe(1);
      expect(a).toBe(1);
    });

    it('should emit initial state only once', () => {
      expect.assertions(2);
      emitBloc.seed();
      emitBloc.seed();
      const [a] = states;
      expect(states.length).toBe(1);
      expect(a).toBe(0);
    });

    it('should publicly emit with __unsafeEmit__', () => {
      expect.assertions(2);
      emitBloc.seed();
      emitBloc.__unsafeEmit__(1);
      const [_, b] = states;
      expect(states.length).toBe(2);
      expect(b).toBe(1);
    });
  });

  describe('Cubit.listenTo', () => {
    class TestBlocForTesting extends Cubit<number> {
      public exposeListenTo(
        observable: Observable<number>,
        observerOrNext: Partial<Observer<number>> | NextFunction<number>
      ) {
        return this.listenTo(observable, observerOrNext);
      }
    }

    let testBloc: TestBlocForTesting;

    beforeEach(() => {
      testBloc = new TestBlocForTesting(0);
    });

    afterEach(() => {
      testBloc.close();
    });

    it('should subscribe to an observable with a next function', () => {
      expect.assertions(1);
      const observable = of(42);
      const nextFn = jest.fn();
      testBloc.exposeListenTo(observable, nextFn);

      expect(nextFn).toBeCalledWith(42);
    });

    it('should subscribe to an observable with an observer object', () => {
      expect.assertions(2);
      const observable = of(42);
      const observer: Partial<Observer<number>> = {
        next: jest.fn(),
        complete: jest.fn(),
      };
      testBloc.exposeListenTo(observable, observer);

      expect(observer.next).toBeCalled();
      expect(observer.complete).toBeCalled();
    });

    it('should handle errors from observable in observer', () => {
      expect.assertions(3);
      const observable = throwError(new Error('test error'));
      const observer: Partial<Observer<number>> = {
        next: jest.fn(),
        complete: jest.fn(),
        error: jest.fn(),
      };
      testBloc.exposeListenTo(observable, observer);

      expect(observer.next).not.toHaveBeenCalled();
      expect(observer.complete).not.toHaveBeenCalled();
      expect(observer.error).toHaveBeenCalled();
    });

    it('should handle scubscription being closed when bloc closes', () => {
      const observable = new Subject<number>();
      const nextFn = jest.fn();

      const subscription = testBloc.exposeListenTo(observable, nextFn);

      expect(subscription.isClosed).toBeFalsy();

      testBloc.close();

      expect(testBloc.isClosed).toBeTruthy();
      expect(subscription.isClosed).toBeTruthy();
    });

    it('should handle manual subscription being closed', () => {
      const observable = new Subject<number>();
      const nextFn = jest.fn();

      const subscription = testBloc.exposeListenTo(observable, nextFn);

      expect(subscription.isClosed).toBeFalsy();

      subscription.unsubscribe();

      expect(subscription.isClosed).toBeTruthy();
    });
  });
});
