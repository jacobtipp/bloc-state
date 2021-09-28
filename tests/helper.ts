import { BlocState } from "../lib";
export enum CounterEvent {
  INCREMENT,
  DECREMENT,
}

export type CounterData = {
  value: number;
};

export class CounterState extends BlocState<CounterData> {
  constructor(initialData?: CounterData) {
    super();
    if (initialData) {
      this.ready(initialData)
    }
  }
}
