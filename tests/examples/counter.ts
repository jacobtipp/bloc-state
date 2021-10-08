import { Cubit } from "../../lib/cubit";
import { BlocState } from "../../lib/state";

const delay = (n: number) => new Promise((resolve) => setTimeout(resolve, n));

export class CounterState extends BlocState<number> {}
export class CounterCubit extends Cubit<CounterState> {
  constructor() {
    super(CounterState.initialize(0));
  }

  transitionHandler(current: CounterState, next: CounterState) {}

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
