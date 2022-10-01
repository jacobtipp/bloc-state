import { Change } from "../lib/change";
import { CounterState } from "./helpers/counter/counter.state";

describe("change", () => {
  it("should create a change object", () => {
    const current = CounterState.ready(0);
    const next = CounterState.ready(1);
    const change = new Change(current, next);

    expect(change.currentState).toBe(current);
    expect(change.nextState).toBe(next);
  });
});
