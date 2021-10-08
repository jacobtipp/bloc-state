import { Cubit } from "../../lib/cubit";
import { BlocState } from "../../lib/state";
export class CounterState extends BlocState<number> {}

export class CounterCubit extends Cubit<CounterState> {
  constructor() {
    super(CounterState.initialize(0));
  }

  transition(current: CounterState, next: CounterState) {
  }

  increment() {
    this.emit(CounterState.ready(this.state.data + 1));
  }

  decrement() {
    this.emit(CounterState.ready(this.state.data - 1));
  }
}
