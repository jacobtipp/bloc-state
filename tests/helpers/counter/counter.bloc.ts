import { Bloc, Transition } from "../../../lib";

import {
  CounterDecrementEvent,
  CounterEvent,
  CounterIncrementEvent,
  CounterNoEmitDataEvent,
} from "./counter.event";
import { CounterDecrementState, CounterIncrementState, CounterState } from "./counter.state";

export class CounterBloc extends Bloc<CounterEvent, CounterState> {
  constructor() {
    super(CounterState.ready(0));

    this.on(CounterIncrementEvent, CounterIncrementState, (event, emit) => {
      emit(CounterState.ready(this.data + 1));
    });

    this.on(CounterDecrementEvent, CounterDecrementState, (event, emit) => {
      emit(CounterState.ready(this.data - 1));
    });

    this.on(CounterNoEmitDataEvent, CounterState, (event, emit) => {
      emit(CounterState.loading());
    });
  }
}
