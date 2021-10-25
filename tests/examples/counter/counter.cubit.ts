import { Cubit } from "../../../lib/cubit";
import { CounterState } from "./counter.state";
import { delay } from "./delay";

export class CounterCubit extends Cubit<CounterState> {
  constructor() {
    super(CounterState.make(0));
  }

  increment() {
    this.emit(CounterState.ready(this.state.data + 1));
  }

  decrement() {
    this.emit(CounterState.ready(this.state.data - 1));
  }

  async asyncIncrement() {
    this.emit(CounterState.loading());
    await delay(3000);
    this.emit(CounterState.ready(this.state.data + 1));
  }
}
