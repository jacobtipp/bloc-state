import { BlocState, Cubit } from "../lib";

/**
 * @class
 * @description
 * * CounterState is a BlocState of type number
 */
export abstract class CounterState extends BlocState<number> {}

/**
 * @class
 * @description
 * * Child classes of CounterState
 */
export class CounterStateInitial extends CounterState {}
export class CounterStateIncrement extends CounterState {}
export class CounterStateDecrement extends CounterState {}

export class CounterCubit extends Cubit<CounterState> {
  constructor() {
    super(CounterStateInitial.initialize(0));
  }

  increment() {
    this.emit(CounterStateIncrement.ready(this.state.data + 1));
  }

  decrement() {
    this.emit(CounterStateDecrement.ready(this.state.data - 1));
  }
}

const counterCubit = new CounterCubit();
