import { Cubit } from '@jacobtipp/bloc';

export class CounterBloc extends Cubit<number> {
  increment() {
    this.emit(this.state + 1);
  }

  setCount(num: number) {
    this.emit(num);
  }
}
