import { Observable, tap } from "rxjs";
import { Cubit } from "../lib";
import { CounterCubit } from "./counter/counter.cubit";

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

  it("should handle async actions", (done) => {
    void (async () => {
      const states: number[] = [];
      state$.pipe(tap((state) => states.push(state))).subscribe({
        complete: () => {
          const [first, second, third, fourth] = states;
          expect(states.length).toBe(4);
          expect(first).toBe(0);
          expect(second).toBe(1);
          expect(third).toBe(0);
          expect(fourth).toBe(1);
          done();
        },
      });
      await cubit.asyncIncrement();
      cubit.close();
    })();
  });

  it("should handle async actions", (done) => {
    void (async () => {
      const states: number[] = [];
      state$.pipe(tap((state) => states.push(state))).subscribe({
        complete: () => {
          const [first, second, third, fourth] = states;
          expect(states.length).toBe(4);
          expect(first).toBe(0);
          expect(second).toBe(1);
          expect(third).toBe(0);
          expect(fourth).toBe(1);
          done();
        },
      });
      await cubit.asyncIncrement();
      cubit.close();
    })();
  });
});
