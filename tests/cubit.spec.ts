import { Observable, scan, tap } from "rxjs";
import { CounterCubit } from "../examples/counter/counter.cubit";
import { CounterState } from "../examples/counter/counter.state";
import { Bloc, BlocState, Cubit } from "../lib";

describe("Cubit", () => {
  let cubit: CounterCubit;
  let state$: Observable<number>;

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
    const states: number[] = [];
    state$.pipe(tap((state) => states.push(state))).subscribe({
      complete: () => {
        const [first, second, third] = states;
        expect(states.length).toBe(3);
        expect(first).toBe(0);
        expect(second).toBe(1);
        expect(third).toBe(2);
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
      const states: number[] = [];
      state$.pipe(tap((state) => states.push(state))).subscribe({
        complete: () => {
        const [first, second, third, fourth] = states;
          expect(states.length).toBe(4);
          expect(first).toBe(0)
          expect(second).toBe(1)
          expect(third).toBe(0)
          expect(fourth).toBe(1)
          done()
        },
      });
      await cubit.asyncIncrement();
      cubit.close();
    })();
  });
});
