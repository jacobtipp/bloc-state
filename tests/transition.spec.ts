import { Transition } from "../lib";
import { IncrementCounterEvent } from "./helpers/counter/counter.event";
import { CounterState } from "./helpers/counter/counter.state";

describe("transition", () => {
  it("should create a transition object", () => {
    const current = CounterState.ready(0);
    const next = CounterState.ready(1);
    const event = new IncrementCounterEvent();
    const transition = new Transition(current, event, next);

    expect(transition.currentState).toBe(current);
    expect(transition.event).toBe(event);
    expect(transition.nextState).toBe(next);
  });
});
