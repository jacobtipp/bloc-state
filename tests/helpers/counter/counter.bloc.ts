import { Bloc, Transition } from "../../../lib";

import {
  CounterEvent,
  DecrementCounterEvent,
  IncrementCounterEvent,
  NoEmitDataEvent,
} from "./counter.event";
import { CounterState } from "./counter.state";

export class CounterBloc extends Bloc<CounterEvent, CounterState> {
  constructor() {
    super(CounterState.ready(0));

    this.on(IncrementCounterEvent, (event, emit) => {
      emit(CounterState.ready(this.data + 1));
    });

    this.on(DecrementCounterEvent, (event, emit) => {
      emit(CounterState.ready(this.data - 1));
    });

    this.on(NoEmitDataEvent, (event, emit) => {
      emit(CounterState.loading());
    });
  }
}
