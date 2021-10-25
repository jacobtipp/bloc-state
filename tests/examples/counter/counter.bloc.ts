import { Bloc } from "../../../lib/bloc";
import { CounterEvent, DecrementCounterEvent, IncrementCounterEvent } from "./counter.event";
import { CounterState } from "./counter.state";

export class CounterBloc extends Bloc<CounterEvent, CounterState> {
  constructor(state: CounterState) {
    super(state);
  }
  onTransition(current: CounterState, next: CounterState, event: CounterEvent) {}

  protected async *mapEventToState(event: CounterEvent) {
    switch (event.constructor.name) {
      case IncrementCounterEvent.name: {
        yield CounterState.ready(this.state.data + 1);
        break;
      }
      case DecrementCounterEvent.name: {
        yield CounterState.ready(this.state.data - 1);
        break;
      }
    }
  }
}
