import { Observable, scan, tap } from "rxjs";
import { Cubit } from "../lib";
import {
  CounterCubit,
  CounterState,
  CounterStateDecrement,
  CounterStateIncrement,
  CounterStateInitial,
} from "./examples";

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

  it("should return new state from actions", (done) => {
    const states: CounterState[] = [];
    state$.subscribe({
      next: (state) => {
        states.push(state);
      },
      complete: () => {
        expect(states.length).toBe(3);
        expect(states[0]).toBeInstanceOf(CounterStateInitial);
        expect(states[0].data).toBe(0);
        expect(states[1]).toBeInstanceOf(CounterStateIncrement);
        expect(states[1].data).toBe(1);
        expect(states[2]).toBeInstanceOf(CounterStateDecrement);
        expect(states[2].data).toBe(0);
        done();
      },
    });
    cubit.increment();
    cubit.decrement();
    cubit.close();
  });

  it("should return different instances of same type", (done) => {
    state$
      .pipe(
        scan((current, next) => {
          expect(current).not.toStrictEqual(next);
          return next;
        })
      )
      .subscribe({
        complete: () => {
          done();
        },
      });

    cubit.increment();
    cubit.increment();
    cubit.close();
  });

  it("should freeze state objects and make them immutable", (done) => {
    const states: CounterState[] = [];
    state$.subscribe({
      next: (state) => {
        expect(Object.isFrozen(state)).toBe(true);
        states.push(state);
      },
      complete: () => {
        done();
      },
    });
    cubit.increment();
    cubit.decrement();
    cubit.close();
  });
});
