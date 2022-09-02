import { Observable, tap } from "rxjs";
import { Cubit } from "../lib";
import { CounterCubit } from "./counter/counter.cubit";
import { CounterState } from "./counter/counter.state";

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
        expect(first.data).toBe(0);
        expect(second.data).toBe(1);
        expect(third.data).toBe(2);
        done();
      },
    });
    cubit.increment();
    cubit.increment();
    cubit.close();
  });

  it("should handle async actions", (done) => {
    void (async () => {
      const states: CounterState[] = [];
      state$.pipe(tap((state) => states.push(state))).subscribe({
        complete: () => {
          const [first, second, third, fourth] = states;
          expect(states.length).toBe(4);
          expect(first.data).toBe(0);
          expect(second.data).toBe(1);
          expect(third.data).toBe(0);
          expect(fourth.data).toBe(1);
          done();
        },
      });
      await cubit.asyncIncrement();
      cubit.close();
    })();
  });

  it("should handle async actions", (done) => {
    void (async () => {
      const states: CounterState[] = [];
      state$.pipe(tap((state) => states.push(state))).subscribe({
        complete: () => {
          const [first, second, third, fourth] = states;
          expect(states.length).toBe(4);
          expect(first.data).toBe(0);
          expect(second.data).toBe(1);
          expect(third.data).toBe(0);
          expect(fourth.data).toBe(1);
          done();
        },
      });
      await cubit.asyncIncrement();
      cubit.close();
    })();
  });
});
