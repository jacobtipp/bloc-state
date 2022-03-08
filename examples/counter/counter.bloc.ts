import { Bloc } from "../../lib";
import { CounterEvent, DecrementCounterEvent, IncrementCounterEvent } from "./counter.event";

export class CounterBloc extends Bloc<CounterEvent, number> {
  constructor() {
    super(0);

    this.on(IncrementCounterEvent, (event, emit) => {
      emit(this.state + 1);
    });

    this.on(DecrementCounterEvent, (event, emit) => {
      emit(this.state - 1);
    });
  }
}
