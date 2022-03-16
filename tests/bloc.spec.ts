import { skip, take } from "rxjs/operators";
import { Bloc } from "../lib";
import { CounterBloc } from "./counter/counter.bloc";
import {
  CounterEvent,
  DecrementCounterEvent,
  IncrementCounterEvent,
} from "./counter/counter.event";

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
    bloc.state$.pipe(skip(1), take(4)).subscribe({
      next: (state) => states.push(state),
      complete: () => {
        const [first, second, third, fourth] = states;
        expect(first).toBe(1);
        expect(second).toBe(2);
        expect(third).toBe(3);
        expect(fourth).toBe(2);
        bloc.close();
        done();
      },
    });
    bloc.addEvent(new IncrementCounterEvent());
    bloc.addEvent(new IncrementCounterEvent());
    bloc.addEvent(new IncrementCounterEvent());
    bloc.addEvent(new DecrementCounterEvent());
  });

  it("should subscribe to state changes and send them to listen method", (done) => {
    class TestBloc extends CounterBloc {
      protected override listen(state: number) {
        expect(state).toBe(0);
        done();
      }
    }

    const bloc = new TestBloc();

    bloc.close();
  });
});
