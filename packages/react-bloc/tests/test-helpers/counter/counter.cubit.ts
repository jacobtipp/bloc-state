import { Cubit } from '@jacobtipp/bloc';

export default class CounterCubit extends Cubit<number> {
  constructor() {
    super(0);
  }

  setCounter = (set: (state: number) => number) => this.emit(set(this.state));
  increment = () => this.emit(this.state + 1);

  decrement = () => this.emit(this.state - 1);
}
