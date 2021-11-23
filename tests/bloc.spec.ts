import { take } from "rxjs/operators";
import { CounterBloc } from "../examples/counter/counter.bloc";
import { IncrementCounterEvent } from "../examples/counter/counter.event";

describe("bloc", () => {
  let bloc: CounterBloc;

  beforeEach(() => {
    bloc = new CounterBloc();
  });

  it("should be defined", () => {
    expect(bloc).toBeDefined();
  });

  it("should have initial state", (done) => {
    bloc.state$.subscribe({
      next: (state) => {
        expect(state).toBe(0);
      },
      complete: () => done(),
    });

    bloc.close();
  });

  it("should map events to state", (done) => {
    const states: number[] = [];
    bloc.state$.pipe(take(3)).subscribe({
      next: (state) => states.push(state),
      complete: () => {
        const [first, second, third] = states;
        expect(first).toBe(0);
        expect(second).toBe(1);
        expect(third).toBe(2);
        bloc.close();
        done();
      },
    });
    bloc.addEvent(IncrementCounterEvent.make());
    bloc.addEvent(IncrementCounterEvent.make());
    bloc.addEvent(IncrementCounterEvent.make());
  });
});
