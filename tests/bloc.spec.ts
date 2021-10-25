import { skip, take } from "rxjs/operators";
import { Bloc } from "../lib";
import { CounterBloc } from "./examples/counter/counter.bloc";
import { CounterEvent, IncrementCounterEvent } from "./examples/counter/counter.event";
import { CounterState } from "./examples/counter/counter.state";

describe("bloc", () => {
  let bloc: CounterBloc;

  beforeEach(() => {
    bloc = new CounterBloc(CounterState.make(0));
  });

  it("should be defined", () => {
    expect(bloc).toBeDefined();
  });

  it("should have initial state", (done) => {
    bloc.state$.subscribe({
      next: (val) => {
        expect(val).toBeInstanceOf(CounterState);
        expect(val.data).toBe(0);
      },
      complete: () => done(),
    });

    bloc.close();
  });

  it("should map events to state", (done) => {
    const states: CounterState[] = [];
    bloc.state$.pipe(skip(1), take(3)).subscribe({
      next: (state) => states.push(state),
      complete: () => {
        const [first, second, third] = states;
        expect(first.data).toBe(1);
        expect(second.data).toBe(2);
        expect(third.data).toBe(3);
				bloc.close()
				done()
      },
    });
    bloc.addEvent(IncrementCounterEvent.make());
    bloc.addEvent(IncrementCounterEvent.make());
    bloc.addEvent(IncrementCounterEvent.make());
  });
});
