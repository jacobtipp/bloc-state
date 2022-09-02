import { Bloc } from "../../lib";

import { CounterEvent, DecrementCounterEvent, IncrementCounterEvent } from "./counter.event";
import { CounterState } from "./counter.state";

export class CounterBloc extends Bloc<CounterEvent, CounterState> {
  constructor() {
    super(CounterState.init(0));

    this.on(IncrementCounterEvent, (event, emit) => emit(CounterState.ready(this.state.data + 1)));
    this.on(DecrementCounterEvent, (event, emit) => emit(CounterState.ready(this.state.data - 1)));
  }
}
