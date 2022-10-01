import { Bloc, Transition } from "../../../lib";

import { CounterEvent, DecrementCounterEvent, IncrementCounterEvent } from "./counter.event";
import { CounterState } from "./counter.state";

export class CounterBloc extends Bloc<CounterEvent, CounterState> {
  constructor() {
    super(CounterState.ready(0));

    this.on(IncrementCounterEvent, (event, emit) => {
      const { data, hasData } = this.state.payload;
      if (hasData) {
        return emit(CounterState.ready(data + 1));
      }
    });

    this.on(DecrementCounterEvent, (event, emit) => {
      const { data, hasData } = this.state.payload;
      if (hasData) {
        return emit(CounterState.ready(data - 1));
      }
    });
  }
}
