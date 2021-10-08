import { Observable, scan, tap } from "rxjs";
import { Bloc, BlocState, Cubit } from "../lib";
import { CounterCubit, CounterState } from "./examples/counter";

describe("Cubit", () => {
  let cubit: CounterCubit;
  let state$: Observable<CounterState>;

  beforeEach(() => {
    cubit = new CounterCubit();
    state$ = cubit.state$;
  });

  it("should create a new Cubit instance", () => {
    expect(cubit).toBeInstanceOf(Cubit);
  });

  it("should close a cubit", (done) => {
    cubit.close();
    cubit.state$.subscribe({
      complete: () => done(),
    });
  });

  it("should return new state from actions", (done) => {
    const states: CounterState[] = [];
    state$.pipe(tap((state) => states.push(state))).subscribe({
      complete: () => {
        const [first, second, third] = states;
        expect(states.length).toBe(3);
        expect(first).toBeInstanceOf(BlocState);
        expect(first.data).toBe(0);
        expect(second).toBeInstanceOf(CounterState);
        expect(second.data).toBe(1);
        expect(third).toBeInstanceOf(CounterState);
        expect(third.data).toBe(2);
        done();
      },
    });
    cubit.increment();
    cubit.increment();
    cubit.close();
  });

  it("should freeze state objects and make them immutable", (done) => {
    state$.pipe(tap((state) => expect(Object.isFrozen(state)))).subscribe({
      complete: done,
    });
    cubit.increment();
    cubit.decrement();
    cubit.close();
  });

  it("should handle async actions", done => {
    void (async () => {
      const states: CounterState[] = [];
      state$.pipe(tap((state) => states.push(state))).subscribe({
        complete: () => {
          const [first, second, third] = states;
          expect(states.length).toBe(3);
          expect(second.isLoading).toBe(true);
          expect(second.hasData).toBe(false);
          expect(third.hasData).toBe(true);
          expect(third.isLoading).toBe(false);
          done()
        },
      });
      await cubit.asyncIncrement();
      cubit.close();
    })();
  });
});
